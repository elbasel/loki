"use client";

import { AutoAnimate, Button, InputWithRef } from "@app/UI";
import { getContextualAiResponse, storeAsEmbeddings } from "./actions";
import { useRef, useState } from "react";

export const TestSupabase: React.FC = () => {
  const [gettingAiResponse, setGettingAiResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [relevantDocuments, setRelevantDocuments] = useState<string[]>();

  const [isAiLearning, setIsAiLearning] = useState(false);

  const askInputRef = useRef<HTMLInputElement>(null);
  const teachInputRef = useRef<HTMLInputElement>(null);

  const handleAsk = async () => {
    const askInputValue = askInputRef.current?.value;
    if (!askInputValue) return;
    askInputRef.current.value = "";

    setGettingAiResponse(true);
    const aiAnswer = await getContextualAiResponse(askInputValue);
    console.log({ aiAnswer });
    setAiResponse(aiAnswer.aiResponse);
    setRelevantDocuments(aiAnswer.relevantDocuments);
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
    <div className="space-y-4">
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
      <div className="flex flex-col gap-4">
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
