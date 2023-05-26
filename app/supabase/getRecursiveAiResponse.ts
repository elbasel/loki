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
    author: "human",
    text: `The following is the information provided: '${contextArray.join(
      " "
    )}' this is the end of the information provided, please take into account the information provided when answering all the following questions, adhering to the same style of our following conversation. use the information provided to provide answers, in case no information is relevant to the question, say that you don't have any information and then offer advice. format your answer as follows: 'Based on provided information': 'answer', 'D, 'Disregarding provided information': 'answer'`,
  });
  messages.push({
    id: Math.random(),
    author: "system",
    text: "the value of y is 2",
  });

  messages.push({
    id: Math.random(),
    author: "human",
    text: "What is the value of y?",
  });

  messages.push({
    id: Math.random(),
    author: "ai",
    text: "According to my current information, the value of y is 2, would you like to know anything else?",
  });

  messages.push({
    id: Math.random(),
    author: "human",
    text: "What is the value of z?",
  });

  messages.push({
    id: Math.random(),
    author: "ai",
    text: "I'm afraid I don't have enough information about the value of z. However the letter z is often used in mathematics to represent an unknown value, would there be anything else you would like to know?",
  });

  messages.push({
    id: Math.random(),
    author: "human",
    text: query,
  });

  const aiResponse = await getChatCompletion(messages);

  return aiResponse.text;
};
