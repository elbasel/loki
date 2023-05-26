import {
  type Message,
  getChatCompletionFromText,
  getChatCompletion,
} from "@app/open-ai";
import { getAllSupabaseDocs } from "@app/supabase";

const _MAX_RECURSION_DEPTH = 2;

export const _getRecursiveAiResponse = async (
  query: string,
  contextArray: string[],
  currentDepth = 0
): Promise<string> => {
  const messages: Message[] = [];

  contextArray.forEach((s) => {
    messages.push({
      id: Math.random(),
      author: "system",
      text: s,
    });
  });

  messages.push({
    id: Math.random(),
    author: "human",
    text: query,
  });

  const aiResponse = await getChatCompletion(messages);

  return aiResponse.text;
};
