"use client";
import { useEffect, useState, useTransition } from "react";
import { getServerOpenAiKey, setServerOpenAiKey } from "./actions";
import { Loader } from "@app/loader";
interface TestOpenAiPageProps {}
export const TestOpenAiPage: React.FC<TestOpenAiPageProps> = ({}) => {
  const [OpenAiKey, setOpenAiKey] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(true);

  useTransition();

  const handleSubmit = (formData: FormData) => {
    if (userPrompt) setServerOpenAiKey(userPrompt);
    const serverOpenAiKey = getServerOpenAiKey();
    setOpenAiKey(serverOpenAiKey);
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
      <output className="flex items-center" name="result">
        Your current Open Ai API Key:{" "}
        {OpenAiKey ||
          (loading ? (
            <Loader />
          ) : (
            <span className="text-red-500">No Key Provided!</span>
          ))}
      </output>
    </form>
  );
};
export default TestOpenAiPage;
