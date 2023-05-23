"use client";

import { AutoAnimate, Button, InputWithRef } from "@app/UI";
import { useRef, useState } from "react";
import { getContextualAiResponse, storeAsEmbeddings } from "@app/supabase";

export const TestSupabase: React.FC = () => {
  const [gettingAiResponse, setGettingAiResponse] = useState(false);
  const [isAiLearning, setIsAiLearning] = useState(false);

  const [aiResponse, setAiResponse] = useState("");
  //refs
  const askInputRef = useRef<HTMLInputElement>(null);
  const teachInputRef = useRef<HTMLInputElement>(null);

  const handleAsk = async () => {
    const askInput = askInputRef.current;
    if (!askInput) return;
    askInputRef.current.value = "";
    setGettingAiResponse(true);
    const aiAnswer = await getContextualAiResponse(askInput.value);
    setAiResponse(aiAnswer?.aiResponse);
    setGettingAiResponse(false);
  };

  const handleTeach = async () => {
    const teachInputValue = teachInputRef.current?.value;
    if (!teachInputValue) return;
    teachInputRef.current.value = "";
    setIsAiLearning(true);
    const storedDocument = await storeAsEmbeddings(teachInputValue);
    setIsAiLearning(false);
  };

  return (
    <div className="space-y-4 ask-ai">
      <div className="flex flex-col gap-4">
        <InputWithRef
          placeholder={gettingAiResponse ? "Thinking..." : "Ask me anything..."}
          ref={askInputRef}
        />
        <Button onClick={handleAsk} disabled={gettingAiResponse}>
          Ask
        </Button>
        <AutoAnimate>{aiResponse}</AutoAnimate>
      </div>
      <div className="flex flex-col gap-4 teach-ai">
        <InputWithRef
          placeholder={isAiLearning ? "Learning..." : "Teach me anything!"}
          ref={teachInputRef}
        />
        <Button onClick={handleTeach} disabled={isAiLearning}>
          Teach
        </Button>
      </div>
    </div>
  );
};
