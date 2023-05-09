"use server";

// example action
export const getServerOpenAiKey = (): string => {
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) {
    throw new Error("OPENAI_API_KEY is not defined");
  }
  return openAiKey;
};

export const setServerOpenAiKey = (openAiKey: string): boolean => {
  try {
    process.env.OPENAI_API_KEY = openAiKey;
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
