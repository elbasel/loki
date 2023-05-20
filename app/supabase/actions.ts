"use server";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SupabaseHybridSearch } from "langchain/retrievers/supabase";
import { createClient } from "@supabase/supabase-js";
import { getChatCompletion, getChatCompletionOnce } from "@app/open-ai/actions";
import { prompts } from "./prompts";

const EMBEDDINGS_TIMEOUT = 0; // 0 means no timeout
const SUPABASE_REQUEST_INTERVAL = 1500; // 1.5s
const SUPABASE_REQUEST_LIMIT = 10; // limit supabase request i to 10 requests for every user sumbit

const supabaseClient = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PRIVATE_KEY || ""
);
const openAiEmbeddings = new OpenAIEmbeddings({
  timeout: EMBEDDINGS_TIMEOUT,
});
const retriever = new SupabaseHybridSearch(openAiEmbeddings, {
  client: supabaseClient,
  // below are the default values, change if needed
  // similarityK: 2,
  // keywordK: 2,
  // tableName: "documents",
  // similarityQueryName: "match_documents",
  // keywordQueryName: "kw_match_documents",
});

const _getKeyWords = async (text: string) => {
  return await getChatCompletionOnce(prompts.getMostImportantKeywords(text));
};

export const getContextualAiResponse = async (input: string) => {
  const relevantDocsSet = new Set();
  const getRelevantDocsPromiseList = [];

  const trimmedInput = input.trim().replaceAll("\n", "");

  const trimmedInputExceedsLimit = true;
  // const trimmedInputExceedsLimit = trimmedInput.length > SUPABASE_REQUEST_LIMIT;

  const summarizedInput = trimmedInputExceedsLimit
    ? trimmedInput.split(" ").join(", ")
    : await _getKeyWords(trimmedInput);

  // a list of words of max length $SUPABASE_REQUEST_LIMIT
  const listOfSummarizedWords = summarizedInput
    .split(", ")
    .slice(0, SUPABASE_REQUEST_LIMIT);

  console.log({ listOfSummarizedWords });

  for (let index = 0; index < listOfSummarizedWords.length; index++) {
    const word = listOfSummarizedWords[index];
    const relevantDocPromise = new Promise<void>(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const relevantDocuments = await retriever.getRelevantDocuments(word);
          const firstDoc = relevantDocuments[0];
          if (firstDoc) relevantDocsSet.add(firstDoc.pageContent);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, SUPABASE_REQUEST_INTERVAL * index);
    });
    getRelevantDocsPromiseList.push(relevantDocPromise);
  }

  await Promise.all(getRelevantDocsPromiseList);

  const queryContext = [...relevantDocsSet].join(" ");
  const aiHasNoContext = queryContext.length === 0;

  if (aiHasNoContext)
    return { aiResponse: prompts.noContextAvailable, relevantDocuments: [] };

  const aiResponse = await getChatCompletion([
    {
      id: Math.random(),
      message: prompts.answerBasedOnContext(queryContext, input),
      author: "system",
    },
  ]);

  return { aiResponse, relevantDocuments: [...relevantDocsSet] };
};

export const storeAsEmbeddings = async (content: string, metadata?: any) => {
  const embedding = await openAiEmbeddings.embedQuery(content);

  const { data, error } = await supabaseClient
    .from("documents")
    .insert([{ content, embedding }])
    .select();

  if (!data) {
    throw Error(error?.message || "Server side error while inserting document");
  }

  return data;
};

// various chain examples, each chain has a different use case
// import { loadSummarizationChain, RetrievalQAChain,ConversationalRetrievalQAChain , loadQARefineChain,  } from "langchain/chains";
// * SummarizationChain
// const chain = loadSummarizationChain(openAiModel, { type: "map_reduce" });
// const summarizedInput = await chain.call({
//   input_documents: splittedInput,
// });

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
