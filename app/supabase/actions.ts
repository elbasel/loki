"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";

const EMBEDDINGS_TIMEOUT = 1000; // 1s timeout

const supabaseClient = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PRIVATE_KEY || ""
);

const openAiEmbeddings = new OpenAIEmbeddings({
  timeout: EMBEDDINGS_TIMEOUT, // 1s timeout
});

export const getRelevantDocuments = async (input: string) => {
  const retriever = new SupabaseHybridSearch(openAiEmbeddings, {
    client: supabaseClient,
    // below are the default values
    // similarityK: 2,
    // keywordK: 2,
    // tableName: "documents",
    // similarityQueryName: "match_documents",
    // keywordQueryName: "kw_match_documents",
  });
  const relevantDocuments = await retriever.getRelevantDocuments(input);

  return relevantDocuments;
};

// returns the id of the inserted document
export const storeAsEmbeddings = async (
  content: string,
  metadata?: any
): Promise<number> => {
  const embeddings = await openAiEmbeddings.embedQuery(content);

  const { data, error } = await supabaseClient
    .from("documents")
    .insert([{ content, embeddings }])
    .select();

  if (error) throw Error(error?.message);

  const { id } = data[0];

  return id;
};

// get embeddings for a multiple documents
// const documentRes = await embeddings.embedDocuments([
//     "Hello world",
//     "Bye bye",
//   ]);
