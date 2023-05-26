"use server";

// model
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
  type BaseChatMessage,
} from "langchain/schema";
// web scraper
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import * as cheerio from "cheerio";
import { _CHAT_OPEN_AI } from "./lib/globals";

// helpers
const _getPageTitle = (html: string): string => {
  const $ = cheerio.load(html);
  const pageTitle = $("title").text();

  return pageTitle;
};

const _getLangChainMessage = (message: _Message): BaseChatMessage => {
  const messageAuthor = message.author;
  switch (messageAuthor) {
    case "human":
      const humanChatMessage = new HumanChatMessage(message.text);
      humanChatMessage.name = "human";
      return humanChatMessage;
    case "ai":
      const aiChatMessage = new AIChatMessage(message.text);
      aiChatMessage.name = "ai";
      return aiChatMessage;
    case "system":
      const systemChatMessage = new SystemChatMessage(message.text);
      systemChatMessage.name = "system";
      return systemChatMessage;
    default:
      const genericChatMessage = new SystemChatMessage(message.text);
      genericChatMessage.name = "system";
      return genericChatMessage;
  }
};

// load url
export type _UrlInfo = {
  url: string;
  title: string;
  html: string;
};
type _CheerioDoc = {
  pageContent: string;
  metadata: {};
};
export const _loadUrl = async (url: string): Promise<_UrlInfo[]> => {
  const urlInfo: _UrlInfo[] = [];
  // const loader = new CheerioWebBaseLoader(url);
  // const cheerioDocs: _CheerioDoc[] = await loader.load();
  // cheerioDocs.forEach((d) => {
  //   urlInfo.push({
  //     url,
  //     title: _getPageTitle(d.pageContent),
  //     html: d.pageContent,
  //   });
  // });

  return urlInfo;
};

// chat with ai
export type _Message = {
  id: number;
  text: string;
  author: "human" | "ai" | "system";
};
export const _getChatCompletion = async (
  messages: _Message[]
): Promise<_Message> => {
  const langchainMessages: BaseChatMessage[] = [];

  messages.forEach((msg: _Message) => {
    const langchainMessage: BaseChatMessage = _getLangChainMessage(msg);
    langchainMessages.push(langchainMessage);
  });

  const newLangChainMessage: BaseChatMessage = await _CHAT_OPEN_AI.call(
    langchainMessages
  );
  const newMessage: _Message = {
    // TODO: use uuid
    id: Math.random(),
    text: newLangChainMessage.text,
    author: "ai",
  };

  return newMessage;
};

export const _getChatCompletionFromText = async (text: string) => {
  const messagesArray: _Message[] = [
    {
      id: Math.random(),
      author: "system",
      text,
    },
  ];

  const newAiMessage: _Message = await _getChatCompletion(messagesArray);
  if (!newAiMessage.text) throw new Error("no ai message returned");

  return newAiMessage.text;
};
