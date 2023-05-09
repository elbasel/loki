"use client";
import { useEffect, useState, useTransition } from "react";
import { getServerOpenAiKey, setServerOpenAiKey } from "./actions";
import { Loader } from "@app/loader";
import { AutoAnimate } from "@app/autoanimate";
import { twMerge } from "tailwind-merge";
interface TestOpenAiPageProps {}
export const TestOpenAiPage: React.FC<TestOpenAiPageProps> = ({}) => {
  const [OpenAiKey, setOpenAiKey] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(true);

  useTransition();

  const handleSubmit = (formData: FormData) => {
    setLoading(true);
    if (userPrompt) setServerOpenAiKey(userPrompt);
    const serverOpenAiKey = getServerOpenAiKey();
    setOpenAiKey(serverOpenAiKey);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const serverOpenAiKey = getServerOpenAiKey();
    setOpenAiKey(serverOpenAiKey);
    setLoading(false);
  }, []);

  return (
    <form className="px-4" action={handleSubmit}>
      <h1>Test Open Ai Api</h1>
      <label hidden htmlFor="prompt">
        Prompt
      </label>
      <input
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Enter your prompt here"
        className="block"
        type="text"
        id="prompt"
        name="prompt"
      />
      <button className="btn" type="submit">
        submit
      </button>
      <output
        className="flex flex-wrap items-center overflow-hidden transition-all"
        name="result"
      >
        <span className="shrink-0">Your current Open Ai API Key: </span>
        <AutoAnimate className="flex items-center">
          {!loading && OpenAiKey ? (
            <span className={twMerge("mx-1 transition-all duration-700")}>
              {OpenAiKey}
            </span>
          ) : loading ? (
            <Loader />
          ) : (
            <span className="mx-1 text-red-500">No Key Provided!</span>
          )}
        </AutoAnimate>
      </output>
    </form>
  );
};
export default TestOpenAiPage;
