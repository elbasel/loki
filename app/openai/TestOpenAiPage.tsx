"use client";
import { ChatWindow } from "@app/chatwindow";
import { ChatMessageProps } from "@app/chatwindow/ChatMessage";
import { useAi } from "@app/openai/useAi";
import { useState } from "react";

export const TestOpenAiPage: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const { aiResponse, loading } = useAi(userPrompt);

  const handleSubmit = async (userPrompt: string) => {
    console.log({ userPrompt });
    if (!userPrompt) return;
    // this also triggers aiResponse to be updated
    setUserPrompt(userPrompt);
    //   const docs = await loadUrl("https://react.dev");
    //   const aiResponse = await getChatCompletionOnce(
    //     formData.get("prompt") as string
    //   );
    //   setAiResponse(aiResponse);
    //   console.log({ docs, aiResponse });
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 300);
  };

  return (
    <ChatWindow
      onSubmit={handleSubmit}
      messages={[
        { id: 0, message: userPrompt, author: "human" },
        { id: 1, message: aiResponse, author: "ai" },
      ]}
      loading={loading}
    />
  );
};
