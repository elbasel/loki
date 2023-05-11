"use client";
import { ChatWindow } from "@app/chatwindow";
import { useAi } from "@app/openai/useAi";
import { useState } from "react";

export const TestOpenAiPage: React.FC = () => {
  const [humanPrompt, setHumanPrompt] = useState("");
  const { aiResponse, loading } = useAi(humanPrompt);

  const handleSubmit = async (formData: FormData) => {
    const prompt = formData.get("prompt");
    if (!prompt) return;
    setHumanPrompt(prompt as string);
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
    <>
      <h1>Test Open Ai Api</h1>
      <ChatWindow
        onSubmit={handleSubmit}
        messages={[
          { id: 0, message: humanPrompt, author: "human" },
          { id: 1, message: aiResponse, author: "ai" },
        ]}
        loading={loading}
        inputName="prompt"
      />
    </>
  );
};
