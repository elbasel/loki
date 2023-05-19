"use server";

import { getChatCompletion } from "@app/open-ai/actions";

const getGoogleSearchQuery = async (userPrompt: string) => {
  const stringToGoogle = getChatCompletion([
    {
      id: Math.random(),
      author: "human",
      message:
        "What should I search for to find out how to use the 'useState' hook in react?, only reply with the search query, do not include anything else",
    },
    {
      id: Math.random(),
      author: "ai",
      message:
        "React docs, React useState hook, React Docs useState hook, How to use useState hook in react",
    },
    {
      id: Math.random(),
      author: "human",
      message: `What should I search for to find out ${userPrompt}, only reply with the search query, do not include anything else`,
    },
  ]);

  return stringToGoogle;
};

export const ask = async (userPrompt: string) => {
  const searchString = await getGoogleSearchQuery(userPrompt);
  // const googleSearchResults;
};
