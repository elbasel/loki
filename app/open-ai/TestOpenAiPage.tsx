"use client";
import { useEffect, useState } from "react";
import { type Message, getChatCompletion } from "./actions";
import { ChatWindow } from "@app/chat-window";

export const TestOpenAiPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  // helper function
  const getAiResponse = async (messages: Message[]) => {
    setLoading(true);
    const aiResponse = await getChatCompletion(messages);
    setAiResponse(aiResponse);
    setLoading(false);
  };

  // set userPrompt on submit
  const handleSubmit = (userPrompt: string) => {
    if (!userPrompt) return;
    setUserPrompt(userPrompt);
  };

  // add userPrompt to messages when it changes
  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      { message: userPrompt, author: "human", id: Math.random() },
    ]);
  }, [userPrompt]);

  // trigger getAiResponse when messages change
  useEffect(() => {
    const lastMessage = messages.at(-1);
    // don't trigger if last message was from ai
    if (lastMessage?.author === "ai") return;
    getAiResponse(messages);
  }, [messages]);

  // add aiResponse to messages when it changes
  useEffect(() => {
    setMessages((prev) => [
      ...prev,
      { message: aiResponse, author: "ai", id: Math.random() },
    ]);
  }, [aiResponse]);

  return (
    <ChatWindow onSubmit={handleSubmit} messages={messages} loading={loading} />
  );
};
