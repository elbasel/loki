"use client";
import { ChatWindow } from "@app/chatwindow";
import { useState } from "react";
import { getChatCompletionOnce } from "./actions";
import { ChatMessageProps } from "@app/chatwindow/ChatMessage";

export const TestOpenAiPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);

  const getNextResponse = async (userPrompt: string) => {
    setLoading(true);
    const aiResponse = await getChatCompletionOnce(userPrompt);
    setMessages((prev) => [
      ...prev,
      { id: 1, message: aiResponse, author: "ai" },
      { id: 2, message: aiResponse, author: "ai" },
      { id: 4, message: aiResponse, author: "ai" },
      { id: 345, message: aiResponse, author: "ai" },
      { id: 345234, message: aiResponse, author: "ai" },
      { id: 3245, message: aiResponse, author: "ai" },
    ]);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (userPrompt: string) => {
    if (!userPrompt) return;
    setMessages((prev) => [
      ...prev,
      { id: 0, message: userPrompt, author: "user" },
    ]);
    getNextResponse(userPrompt);
  };

  return (
    <ChatWindow onSubmit={handleSubmit} messages={messages} loading={loading} />
  );
};
