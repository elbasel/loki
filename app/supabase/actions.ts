"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { _getChatCompletionFromText } from "@app/open-ai/actions";
import { createClient } from "@supabase/supabase-js";
// should be global, not scoped to supabase
import { PromptGenerator, promptTemplates } from "./prompts";
import { getRecursiveAiResponse } from ".";
import { revalidateTag } from "next/cache";

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
  similarityK: 100,
  keywordK: 100,
});

const _getMostImportantKeywords = async (text: string): Promise<string[]> => {
  const generatePrompt = PromptGenerator.new(
    promptTemplates.getMostImportantKeywords
  );
  const prompt: string = generatePrompt({
    text,
  });
  const aiResponse = await _getChatCompletionFromText(prompt);
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
  revalidateTag("supabase");
  const relevantDocuments = await _getRelevantDocs(input);
  const aiResponse: string = await getRecursiveAiResponse(
    input.trim().replaceAll("\n", " "),
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

export const _getRelevantDocs = async (input: string): Promise<string[]> => {
  const relevantDocs: string[] = [];
  const trimmedInput = input.trim().replaceAll("\n", " ");
  const inputRelevantDocs = await _RETRIEVER.getRelevantDocuments(trimmedInput);
  inputRelevantDocs.forEach((d) => {
    relevantDocs.push(d.pageContent);
  });
  return relevantDocs;
};

export const _getAllSupabaseDocs = async (table: string): Promise<string[]> => {
  const allDocs: string[] = [];
  const { data, error } = await _SUPABASE_CLIENT.from(table).select("*");
  if (error) throw error;
  if (!data) throw new Error("No data returned from supabase");
  data.forEach((d) => {
    const { content, id, metadata, embedding } = d;
    if (content == "") throw new Error("Content is empty");
    allDocs.push(content);
  });
  return allDocs;
};
