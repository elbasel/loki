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

  messages.push({
    id: Math.random(),
    author: "system",
    text: `you are a personal assistant, you are provided with the user's saved documents, your aim is to understand and index these documents and then answer the user's query, the user assumes that you are using his documents to answer questions.
  As an example:
  Provided Documents: 'elbasel is a dev. elbasel has short hair'
  user: who is elbasel?
  ai; elbasel is a developer with short hair, I don't have any further info, please add more info to your documents so that I can further assist you.
  The following is the actual provided documents that should be used to assist the user: '${contextArray.join(
    ". "
  )}'.`,
  });

  messages.push({
    id: Math.random(),
    author: "human",
    text: query,
  });
  
  const aiResponse = await getChatCompletion(messages);

  return aiResponse.text;
};
