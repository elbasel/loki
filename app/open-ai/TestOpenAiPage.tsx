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
    setTimeout(() => {
      setLoading(false);
    }, 0);
  };

  // set userPrompt on submit
  const handleSubmit = (userPrompt: string) => {
    setUserPrompt(userPrompt);
  };

  // add userPrompt to messages when it changes
  useEffect(() => {
    if (!userPrompt) return;
    setMessages((prev) => [
      ...prev,
      { message: userPrompt, author: "human", id: Math.random() },
    ]);
  }, [userPrompt]);

  // trigger getAiResponse when messages change
  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages.at(-1);
    // don't trigger if last message was from ai
    if (lastMessage?.author === "ai") return;
    getAiResponse(messages);
  }, [messages]);

  // add aiResponse to messages when it changes
  useEffect(() => {
    if (!aiResponse) return;
    setMessages((prev) => [
      ...prev,
      { message: aiResponse, author: "ai", id: Math.random() },
    ]);
  }, [aiResponse]);

  return (
    <ChatWindow onSubmit={handleSubmit} messages={messages} loading={loading} />
  );
};
