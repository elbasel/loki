"use client";

import { useRef, useState } from "react";
import { AutoAnimate, Button, InputWithRef } from "@app/UI";
import {
  ContextualAiResponse,
  getAllSupabaseDocs,
  getContextualAiResponse,
  storeAsEmbeddings,
} from "@app/supabase";
import { _getChatCompletionFromText } from "@app/open-ai/actions";

export const TestSupabase: React.FC = () => {
  const [gettingAiResponse, setGettingAiResponse] = useState(false);
  const [isAiLearning, setIsAiLearning] = useState(false);

  const [aiResponse, setAiResponse] = useState("");
  const [relevantDocs, setRelevantDocs] = useState<string[]>();
  //refs
  const askInputRef = useRef<HTMLInputElement>(null);
  const teachInputRef = useRef<HTMLInputElement>(null);

  const handleAsk = async () => {
    const askInput = askInputRef.current;
    if (!askInput) return;
    setGettingAiResponse(true);
    const aiAnswer: ContextualAiResponse = await getContextualAiResponse(
      askInput.value
    );
    if (aiAnswer.relevantDocuments.length === 0 && teachInputRef.current) {
      const aiQuestion = await _getChatCompletionFromText(
        `provide a placeholder for an input field with information about a users's query: '${askInput.value}', the placeholder should be descriptive of the expected input and should be aimed to provide all the data needed for an ai language model to answer the users's query`
      );
      teachInputRef.current.placeholder = aiQuestion;
    } else if (aiAnswer.relevantDocuments.length > 0 && teachInputRef.current) {
      const aiQuestion = "Thank you!";
      teachInputRef.current.placeholder = aiQuestion;
    }
    askInputRef.current.value = "";

    setAiResponse(aiAnswer.aiResponse);
    setRelevantDocs(aiAnswer.relevantDocuments);
    setGettingAiResponse(false);
  };

  const handleTeach = async () => {
    const teachInputValue = teachInputRef.current?.value;
    if (!teachInputValue) return;
    teachInputRef.current.value = "";
    setIsAiLearning(true);
    const storedDocument = await storeAsEmbeddings(teachInputValue);
    // setStoredDoc(storedDocument)
    console.log(storedDocument);
    setIsAiLearning(false);
  };

  return (
    <main className="space-y-8">
      <div className="space-y-4 ask-ai">
        <div className="flex flex-col gap-4">
          <InputWithRef
            placeholder={
              gettingAiResponse ? "Thinking..." : "Ask me anything..."
            }
            ref={askInputRef}
            disabled={gettingAiResponse}
            className={(gettingAiResponse && "opacity-50") || undefined}
          />
          <Button onClick={handleAsk} disabled={gettingAiResponse}>
            Ask
          </Button>
          <AutoAnimate>{aiResponse}</AutoAnimate>
          <ul>
            <AutoAnimate>
              {relevantDocs?.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </AutoAnimate>
          </ul>
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
    </main>
  );
};
