"use client";
import { useState } from "react";
import { ChatWindow } from "@app/UI/chat-window";
import { type Message, getChatCompletion } from ".";

//helper function

const getAiResponse = async (messages: Message[]) => {
  const aiResponse: Message = await getChatCompletion(messages);
  return aiResponse;
};

export const TestOpenAiPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // set userPrompt on submit
  const handleSubmit = async (userPrompt: string) => {
    if (!userPrompt || loading) return;
    setLoading(true);
    const newMessages: Message[] = [
      ...messages,
      { text: userPrompt, author: "human", id: Math.random() },
    ];
    // add userPrompt to messages
    setMessages(newMessages);
    const aiResponse: Message = await getAiResponse(newMessages);

    const newMessagesWithAiResponse: Message[] = [...newMessages, aiResponse];
    // ad aiResponse to messages
    setMessages(newMessagesWithAiResponse);
    setLoading(false);
  };

  return (
    <main className="max-h-screen overflow-hidden">
      <ChatWindow
        onSubmit={(v) => {
          setLoading(true);
          setTimeout(() => {
            handleSubmit(v);
          }, 0);
          setLoading(false);
        }}
        messages={messages}
        loading={loading}
      />
    </main>
  );
};
