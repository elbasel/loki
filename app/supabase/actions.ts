"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { RetrievalQAChain, loadQARefineChain } from "langchain/chains";

import { OpenAI } from "langchain/llms/openai";

import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { Message, getChatCompletion } from "@app/open-ai/actions";
// import { HNSWLib } from "langchain/vectorstores/hnswlib";

const EMBEDDINGS_TIMEOUT = 0;
const SUPABASE_REQUEST_INTERVAL = 1500; // 1.5s
const SUPABASE_REQUEST_LIMIT = 10; // 10 requests per prompt

const openAiChatModel = new OpenAI({
  modelName: "gpt-3-turbo",
});

const supabaseClient = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PRIVATE_KEY || ""
);

const openAiEmbeddings = new OpenAIEmbeddings({
  timeout: EMBEDDINGS_TIMEOUT, // 1s timeout
});

const retriever = new SupabaseHybridSearch(openAiEmbeddings, {
  client: supabaseClient,
  // below are the default values
  similarityK: 2,
  keywordK: 2,
  tableName: "documents",
  similarityQueryName: "match_documents",
  keywordQueryName: "kw_match_documents",
});

// const supabaseBaseRetriever = new SupabaseVectorStore(openAiEmbeddings, {
//   client: supabaseClient,
//   tableName: "documents",
//   queryName: "match_documents",
// }).asRetriever();

// Converts the input to embeddings automatically
// and then returns the relevant documents by comparing the embeddings
// with the embeddings of the documents in the database
export const getRelevantDocuments = async (input: string) => {
  // ? does this work
  // revalidateTag("supabase");

  const relevantDocumentSet: any = new Set();

  const relevantDocsPromiseList = [];

  // const relevantDocuments = await retriever.getRelevantDocuments(input);
  // console.log({ relevantDocuments });

  const listOfWords = [...input.trim().replaceAll("\n", "").split(" ")];

  for (let index = 0; index < listOfWords.length; index++) {
    const word = listOfWords[index];
    if (index > SUPABASE_REQUEST_LIMIT) break;
    const relevantDocPromise = new Promise<void>(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const relevantDocuments = await retriever.getRelevantDocuments(word);
          const firstDoc = relevantDocuments[0];
          if (firstDoc) relevantDocumentSet.add(firstDoc.pageContent);

          resolve();
        } catch (error) {
          reject(error);
        }
      }, SUPABASE_REQUEST_INTERVAL * index);
    });
    relevantDocsPromiseList.push(relevantDocPromise);
  }

  await Promise.all(relevantDocsPromiseList);

  console.log(relevantDocsPromiseList);

  // relevantDocuments.add(
  //   (await retriever.getRelevantDocuments(input))[0]?.pageContent
  // );

  // const relevantDocuments = await retriever.getRelevantDocuments(input);
  // console.log({ relevantDocuments });

  // * QARefineChain
  // const chain = loadQARefineChain(openAiChatModel, {});
  // const aiResponse = await chain.call({
  //   input_documents: relevantDocuments,
  //   question: input,
  // });

  // * ConversationalRetrievalQAChain
  // const chain = ConversationalRetrievalQAChain.fromLLM(
  //   openAiChatModel,
  //   retriever
  // );
  // const aiResponse = await chain.call({
  //   question: input,
  //   chat_history: ['my name is ahmed'],
  // });

  // * RetrievalQAChain
  // const chain = new RetrievalQAChain({
  //   combineDocumentsChain: loadQARefineChain(openAiChatModel),
  //   retriever: supabaseBaseRetriever,
  // });
  // const aiResponse = await chain.call({
  //   query: input,
  // });

  const aiResponse = await getChatCompletion([
    {
      id: Math.random(),
      message: `Only base your answers on the following context to answer the query, in case you need to know more about the context, please ask me to show you the context, otherwise say 'I don't know', never provide information that is not in the context.
      context: ${[...relevantDocumentSet].join(" ")}

      query: ${input}
      `,
      author: "system",
    },
  ]);

  // * return the response and the relevant documents
  return { aiResponse, relevantDocuments: [...relevantDocumentSet] };
  // return relevantDocuments;

  // console.log({ chain });

  // const functionResponse = {
  //   res: aiResponse,
  //   pageContent: relevantDocuments[0]?.pageContent,
  //   docsLength: relevantDocuments?.length,
  // };
  // console.log(functionResponse);
  // return functionResponse;

  // let { data, error } = await supabaseClient.rpc("kw_match_documents", {
  //   match_count: 2,
  //   query_text: input,
  // });
  // console.log({ data, error });

  // ! error handling
  // if (error) console.error(error)
  // else console.log(data)
  // return data;
  // ========================================================
  // revalidateTag("supabase");

  // return { input, rpcDocs: data, error };
};

// returns the id of the inserted document
export const storeAsEmbeddings = async (content: string, metadata?: any) => {
  const embedding = await openAiEmbeddings.embedQuery(content);

  const { data, error } = await supabaseClient
    .from("documents")
    .insert([{ content, embedding }])
    .select();

  if (!data) {
    throw Error(error?.message || "Server side error while inserting document");
  }

  // const vectorStore = await SupabaseVectorStore.fromExistingIndex(
  //   data[0].embeddings,
  //   {
  //     client: supabaseClient,
  //     tableName: "documents",
  //     queryName: "match_documents",
  //   }
  // );
  // console.log({ vectorStore });

  return data;
};

export const test = async () => {
  // const vectorStore = await SupabaseVectorStore.fromExistingIndex()
};
// get embeddings for a multiple documents
// const documentRes = await embeddings.embedDocuments([
//     "Hello world",
//     "Bye bye",
//   ]);
