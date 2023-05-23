"use client";
import { useState } from "react";
import { ChatWindow } from "@app/chat-window";
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
    if (!userPrompt) return;
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
    <main>
      <ChatWindow
        onSubmit={(v) => {
          setLoading(true);
          setTimeout(() => {
            handleSubmit(v);
          }, 1000);
          setLoading(false);
        }}
        messages={messages}
        loading={loading}
      />
    </main>
  );
};
