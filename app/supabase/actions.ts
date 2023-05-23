"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { loadQARefineChain } from "langchain/chains";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getChatCompletionFromText } from "@app/open-ai/actions";
// should be global
import { PromptGenerator, promptTemplates } from "./prompts";
import { Message, getChatCompletion } from "@app/open-ai";

// TODO: move to env
// supabase
const _SUPABASE_REQUEST_INTERVAL = 1500; // 1.5s
const _SUPABASE_REQUEST_LIMIT = 10; // limit supabase request i to 10 requests for every user sumbit
const _SUPABASE_CLIENT = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PRIVATE_KEY || ""
);

// openai
const _EMBEDDINGS_TIMEOUT = 0; // 0 means no timeout
const _USER_INPUT_LIMIT = 1000; // 1000 tokens, token ~= 1 word
const _CHAT_OPEN_AI_MODEl = new ChatOpenAI();
const _OPEN_AI_EMBEDDINGS = new OpenAIEmbeddings({
  timeout: _EMBEDDINGS_TIMEOUT,
});
const _RETRIEVER = new SupabaseHybridSearch(_OPEN_AI_EMBEDDINGS, {
  client: _SUPABASE_CLIENT,
});

const _getMostImportantKeywords = async (text: string): Promise<string[]> => {
  const generatePrompt = PromptGenerator.new(
    promptTemplates.getMostImportantKeywords
  );
  const prompt: string = generatePrompt({
    text,
  });
  const aiResponse = await getChatCompletionFromText(prompt);
  const keywords = aiResponse.split(", ");
  const isValidKeyWords = keywords.length > 0 && keywords.length <= 10;
  if (!isValidKeyWords) {
    console.log({ keywords });
    throw new Error("Invalid keywords");
  }

  return keywords;
};

export type _ContextualAiResponse = {
  aiResponse: string;
  relevantDocuments: string[];
};
export const _getContextualAiResponse = async (
  input: string
): Promise<_ContextualAiResponse> => {
  const contextualResponse: _ContextualAiResponse = {
    aiResponse: "",
    relevantDocuments: [],
  };
  const relevantDocsSet: Set<string> = new Set();
  const relevantDocsPromiseList: Promise<void>[] = [];
  const trimmedInput = input.trim().replaceAll("\n", " ");

  //get relevant docs for the input as a whole
  // !! TODO: only it's less than _USER_INPUT_LIMIT tokens....
  // const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
  // const tokens = tokenizer.encode(input);
  // if (tokens.length > _USER_INPUT_LIMIT) () => {
  // * otherwise...
  //
  // };
  const inputRelevantDocs = await _RETRIEVER.getRelevantDocuments(input);
  // * only add the first relevant doc, since it's the most relevant
  if (inputRelevantDocs[0])
    relevantDocsSet.add(inputRelevantDocs[0].pageContent);

  const inputSplit = trimmedInput.split(" ");
  if (inputSplit.length === 0) throw new Error("Invalid input");
  if (inputSplit.length > _SUPABASE_REQUEST_LIMIT) {
    const keywords = await _getMostImportantKeywords(trimmedInput);
    console.log({ keywords });
    if (keywords.length > 10) {
      console.log({ keywords });
      throw new Error("Too many keywords");
    }
    for (let index = 0; index < keywords.length; index++) {
      const word = keywords[index];
      // resolved after adding relevant doc to set\\
      const relevantDocPromise = new Promise<void>(async (resolve, reject) => {
        setTimeout(async () => {
          try {
            const relevantDocuments = await _RETRIEVER.getRelevantDocuments(
              word
            );
            const firstDoc = relevantDocuments[0];
            if (firstDoc) relevantDocsSet.add(firstDoc.pageContent);
            resolve();
          } catch (error) {
            reject(error);
          }
        }, _SUPABASE_REQUEST_INTERVAL * index);
      });
      relevantDocsPromiseList.push(relevantDocPromise);
    }

    await Promise.all(relevantDocsPromiseList);

    const aiHasNoContext = [...relevantDocsSet].length === 0;

    if (aiHasNoContext)
      return {
        aiResponse: promptTemplates.noContextAvailable,
        relevantDocuments: [],
      };
  }

  const relevantDocsArray: string[] = [...relevantDocsSet];

  const messages: Message[] = [
    {
      id: Math.random(),
      author: "system",
      text: [...relevantDocsSet].join(" "),
    },
    {
      id: Math.random(),
      author: "human",
      text: input,
    },
  ];
  const aiResponse = await getChatCompletion(messages);
  if (!aiResponse.text) throw new Error("empty ai response");
  return {
    aiResponse: aiResponse.text,
    relevantDocuments: relevantDocsArray,
  };
};

export const _storeAsEmbeddings = async (content: string, metadata?: any) => {
  const embedding = await _OPEN_AI_EMBEDDINGS.embedQuery(content);

  const supabaseResponse: "error" | "success" = await _insertDocument(
    content,
    embedding
  );
  if (supabaseResponse === "error")
    throw new Error("Failed to insert document into supabase");
  return supabaseResponse;
};

const _insertDocument = async (
  content: string,
  embedding: number[]
): Promise<"error" | "success"> => {
  const response = await _SUPABASE_CLIENT
    .from("documents")
    .insert([{ content, embedding }])
    .select();

  if (response.error) return "error";
  return "success";
};
