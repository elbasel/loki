"use client";
import { TestOpenAiPage } from "./TestOpenAiPage";

export const fetchCache = "force-no-store";

const OpenAiPage: React.FC = () => {
  return (
    <>
      <TestOpenAiPage />
    </>
  );
};

export default OpenAiPage;
