"use server";
import { kv } from "@vercel/kv";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

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
  console.log(messages);
  const currentTime: string = new Date().toISOString();
  await kv.set(currentTime, JSON.stringify(messages));

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
