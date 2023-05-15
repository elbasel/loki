"use server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  ChainValues,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

//test
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { getGoogleSearchResults } from "@app/google/actions";

export interface Message {
  id: number;
  message: string;
  author: "human" | "ai";
}

// example action
// export const getServerOpenAiKey = (): string => {
//   const openAiKey = process.env.OPENAI_API_KEY;
//   if (!openAiKey) {
//     throw new Error("OPENAI_API_KEY is not defined");
//   }
//   console.log({ openAiKey });
//   return openAiKey;
// };

export const loadUrl = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();

  return docs;
};

export const getChatCompletionOnce = async (prompt: string) => {
  const chat = new ChatOpenAI();
  const response = await chat.call([new HumanChatMessage(prompt)]);
  return response.text;
};

export const getChatCompletion = async (messages: Message[]) => {
  const chat = new ChatOpenAI();
  const response = await chat.call(
    messages.map((message) =>
      message.author === "human"
        ? new HumanChatMessage(message.message)
        : new AIChatMessage(message.message)
    )
  );
  return response.text;
};

export const getInformedAiResponse = async (
  query: string
): Promise<{
  response: string;
  sources: string[];
}> => {
  const model = new OpenAI();
  const baseCompressor = LLMChainExtractor.fromLLM(model);

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const googleSearchResults = await getGoogleSearchResults(query);

  const googleUrl = googleSearchResults.googleQueryURl;
  const googleQueryURLContent = (await loadUrl(googleUrl))[0].pageContent;
  const searchResults = googleSearchResults.searchResults;

  // console.log({ searchResults })

  // console.log({content: searchResults[0].pageContent})
  const docs = await textSplitter.createDocuments([
    googleQueryURLContent,
    // (await loadUrl(searchResults[0].url))[0].pageContent,
    // (await loadUrl(searchResults[1].url))[0].pageContent,
    // (await loadUrl(searchResults[2].url))[0].pageContent,
  ]);
  // console.log({ docs });

  // // Create a vector store from the documents.
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  const retriever = new ContextualCompressionRetriever({
    baseCompressor,
    baseRetriever: vectorStore.asRetriever(),
  });

  const chain = RetrievalQAChain.fromLLM(model, retriever);

  const res = await chain.call({
    query,
  });
  // console.log(docs);

  console.log({ res });
  const aiResponse = await getChatCompletionOnce(
    `use the following information to answer the {query}, only reply with the relevant information sufficient to answer the query: ${res.text}. {query}: ${query}}`
  );
  return {
    response: aiResponse,
    // sources: [googleUrl, ...searchResults.map((r) => r.url)],
    sources: [googleUrl],
  };
};
