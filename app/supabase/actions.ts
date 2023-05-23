"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getChatCompletionFromText } from "@app/open-ai/actions";
import { createClient } from "@supabase/supabase-js";
// should be global, not scoped to supabase
import { PromptGenerator, promptTemplates } from "./prompts";
import { getRecursiveAiResponse as _getRecursiveAiResponse } from "./util/getRecursiveAiResponse";

// !! import { revalidatePath } from "next/cache";

// TODO: move to env
// supabase
const _SUPABASE_REQUEST_INTERVAL = 1500; // 1.5s
const _SUPABASE_REQUEST_LIMIT = 10; // limit supabase request i to 10 requests for every user sumbit
const _SUPABASE_CLIENT = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PRIVATE_KEY || ""
);

type SupaBaseDoc = {
  count: null | number;
  data: null | {
    content: string;
    created_at: string;
    embedding: string;
  };
  id: null | number;
  // error: null | Error;
  status: number;
  statusText: string;
};

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
  const relevantDocuments = await _getRelevantDocs(input);
  const aiResponse: string = await _getRecursiveAiResponse(
    input,
    relevantDocuments
  );

  return {
    aiResponse,
    relevantDocuments,
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

const _getRelevantDocs = async (input: string): Promise<string[]> => {
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
  inputRelevantDocs.forEach((d) => {
    relevantDocsSet.add(d.pageContent);
  });
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
  }
  const relevantDocsArray: string[] = [...relevantDocsSet];
  // if (relevantDocsArray.length === 0) {
  // }
  return relevantDocsArray;
};
