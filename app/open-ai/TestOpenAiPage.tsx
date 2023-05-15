"use client";
import { useEffect, useState } from "react";
import {
  type Message,
  getChatCompletion,
  getInformedAiResponse,
} from "./actions";
import { ChatWindow } from "@app/chat-window";

export const TestOpenAiPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [sources, setSources] = useState<string[]>();

  // TODO: Refactor into smaller functions

  // this triggers adding the user prompt to messages
  const getAiResponse = async (messages: Message[]) => {
    setLoading(true);
    // const aiResponse = await getChatCompletion(messages);
    const aiResponse = await getInformedAiResponse(userPrompt);
    setAiResponse(aiResponse.response);
    setSources(aiResponse.sources);

    setLoading(false);
  };

  // set the user prompt when the user submits a message
  // this triggers the useEffect below
  const handleSubmit = (userPrompt: string) => {
    if (!userPrompt) return;
    setUserPrompt(userPrompt);
    const newMessages: Message[] = [
      ...messages,
      { message: userPrompt, author: "human", id: 1 },
    ];
    setMessages(newMessages);
  };

  // start the ai response retrieval when the user prompt changes
  useEffect(() => {
    if (!userPrompt) return;
    const newMessages: Message[] = [
      ...messages,
      { message: userPrompt, author: "human", id: Math.random() },
    ];

    getAiResponse(newMessages);
  }, [userPrompt]);

  // add the ai response to messages
  useEffect(() => {
    const newMessages: Message[] = [
      ...messages,
      { message: aiResponse, author: "ai", id: Math.random() },
      { message: sources?.join("\n") || "", author: "ai", id: Math.random() },
    ];
    setMessages(newMessages);
  }, [aiResponse]);

  return (
    <ChatWindow onSubmit={handleSubmit} messages={messages} loading={loading} />
  );
};
