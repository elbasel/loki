import { ChatOpenAI } from "langchain/chat_models/openai";

export const _CHAT_OPEN_AI = new ChatOpenAI({
  frequencyPenalty: 0,
  presencePenalty: 0,
  temperature: 1,
  modelName: "gpt-3.5-turbo",
  topP: 1,
  maxTokens: 256,
});
