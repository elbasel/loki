"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { loadQARefineChain } from "langchain/chains";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getChatCompletionFromText } from "@app/open-ai/actions";
// should be global
import { PromptGenerator, promptTemplates } from "./prompts";

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

export const _getContextualAiResponse = async (input: string) => {
  const relevantDocsSet: Set<string> = new Set();
  const getRelevantDocsPromiseList = [];

  const trimmedInput = input.trim().replaceAll("\n", " ");

  const inputSplit = trimmedInput.split(" ");
  if (inputSplit.length === 0) throw new Error("Invalid input");
  if (inputSplit.length > _SUPABASE_REQUEST_LIMIT) {
    const keywords = await _getMostImportantKeywords(trimmedInput);
    if (keywords.length > 10) {
      console.log({ keywords });
      throw new Error("Too many keywords");
    }
    for (let index = 0; index < keywords.length; index++) {
      const word = keywords[index];
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
      getRelevantDocsPromiseList.push(relevantDocPromise);
    }

    await Promise.all(getRelevantDocsPromiseList);

    //also get relevant docs for the input as a whole
    // !! TODO: if it's less than _USER_INPUT_LIMIT tokens.
    // const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    // const tokens = tokenizer.encode(input);
    // if (tokens.length > _USER_INPUT_LIMIT) () => {};

    const wholeInputRelevantDocs = await _RETRIEVER.getRelevantDocuments(input);
    if (wholeInputRelevantDocs[0])
      relevantDocsSet.add(wholeInputRelevantDocs[0].pageContent);

    const queryContext = [...relevantDocsSet].join(" ");
    const aiHasNoContext = queryContext.length === 0;

    if (aiHasNoContext)
      return {
        aiResponse: promptTemplates.noContextAvailable,
        relevantDocuments: [],
      };

    const chain = loadQARefineChain(_CHAT_OPEN_AI_MODEl);

    const relevantDocsArray: string[] = [...relevantDocsSet];

    const aiResponse = await chain.call({
      input_documents: relevantDocsArray,
      question: input,
    });

    return {
      aiResponse: aiResponse.output_text,
      relevantDocuments: relevantDocsArray,
    };
  }
};

export const _storeAsEmbeddings = async (content: string, metadata?: any) => {
  const embedding = await _OPEN_AI_EMBEDDINGS.embedQuery(content);

  const { data, error } = await _SUPABASE_CLIENT
    .from("documents")
    .insert([{ content, embedding }])
    .select();

  if (!data) {
    throw Error(error?.message || "Server side error while inserting document");
  }

  return data;
};
