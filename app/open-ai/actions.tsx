"use server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

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
