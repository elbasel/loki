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
  console.log("Getting ai response for the following parameters");
  console.log({ query, contextArray, currentDepth });

  const messages: Message[] = [];

  messages.push({
    id: Math.random(),
    author: "system",
    text: `you are a personal assistant, you are provided with the user's saved documents, your aim is to understand and index these documents and then answer the user's query, the user assumes that you are using his documents to answer questions.
  As an example:
  Provided Documents: 'elbasel is a dev. elbasel has short hair'
  user: who is elbasel?
  ai; elbasel is a developer with short hair, Please tell me if I can do anything else to help :) (response should be friendly, natrual sounding, similar to jarvis from ironman).
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

  console.log("Got ai response: ", aiResponse);
  return aiResponse.text;
};
