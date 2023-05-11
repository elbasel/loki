import { useEffect, useState } from "react";
import { getChatCompletionOnce } from "./actions";

export const useAi = (prompt: string) => {
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const getResponse = async (prompt: string) => {
    if (!prompt) return;
    setLoading(true);
    const aiResponse = await getChatCompletionOnce(prompt);
    setAiResponse(aiResponse);
    setLoading(false);
  };

  useEffect(() => {
    getResponse(prompt);
  }, [prompt]);

  return { aiResponse, loading };
};
