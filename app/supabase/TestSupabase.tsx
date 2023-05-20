"use client";

import { Button } from "@app/UI/Button";
import { getRelevantDocuments, storeAsEmbeddings } from "./actions";
import { useRef, useState } from "react";
import { InputWithRef } from "@app/UI/Input";
import { Loader } from "@app/loader";

interface TestSupabaseProps {}

export const TestSupabase: React.FC<TestSupabaseProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    setLoading(true);

    const inputValue = inputRef.current?.value;
    if (!inputValue) return;

    // * store a document
    // const storedDocument = await storeAsEmbeddings(inputValue);
    // console.log(storedDocument);

    // * retrieve a document
    const res = await getRelevantDocuments(inputValue);
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
      <output>
        <pre id="output">
          {loading && <Loader />}
          {aiResponse && aiResponse}
        </pre>
      </output>
    </>
  );
};
