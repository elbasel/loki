"use client";

import { Button } from "@app/UI/Button";
import { getContextualAiResponse, storeAsEmbeddings } from "./actions";
import { useRef, useState } from "react";
import { InputWithRef } from "@app/UI/Input";
import { Loader } from "@app/loader";

interface TestSupabaseProps {}

export const TestSupabase: React.FC<TestSupabaseProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;

    setLoading(true);

    // * store a document a document in the database
    // const storedDocument = await storeAsEmbeddings(inputValue);
    // console.log(storedDocument);

    // * get a response based on relevant documents in the database
    const res = await getContextualAiResponse(inputValue);
    console.log(res);
    setAiResponse(res.aiResponse || "");

    setLoading(false);
  };

  return (
    <>
      <InputWithRef ref={inputRef} />
      <Button disabled={loading} onClick={handleClick}>
        Run
      </Button>
      <output className="flex-center-1">
        {aiResponse && aiResponse}
      </output>
    </>
  );
};
