"use client";

import { Button } from "@app/UI/Button";
import { getRelevantDocuments, storeAsEmbeddings } from "./actions";

interface TestSupabaseProps {}

export const TestSupabase: React.FC<TestSupabaseProps> = ({}) => {
  const handleClick = async () => {
    const storedDocumentId = await storeAsEmbeddings("hello world");
    console.info(`Document stored with id '${storedDocumentId}'`);
  };

  return (
    <>
      <Button onClick={handleClick}>Run</Button>
    </>
  );
};
