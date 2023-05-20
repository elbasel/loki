export const prompts = {
  noContextAvailable:
    "I'm sorry but I don't have any context available to answer your query, please try again later.",
  answerBasedOnContext: (context: string, query: string) =>
    `Only base your answers on the following context to answer the query, in case you need to know more about the context, please ask me to show you the context, otherwise say 'I don't know', never provide information that is not in the context and please always output your answer in markdown format. context: ${context} query: ${query}`,
  getMostImportantKeywords: (text: string) =>
    // `Summarize the following text in no more than ${SUPABASE_REQUEST_LIMIT} words, do not change the meaning of the text or try to answer it in any way, only shorten it while retaining the same meaning, if it's not possible to summarize the text in ${SUPABASE_REQUEST_LIMIT} words or less then you can respond with more words but in that case sort them by the importance: ${text}`
    `Extract the most important keywords out of the following text so that if used in a search engine it would return the most relevant results, as an example if provided by 'how does the useEffect hook work in react' then you should reply with 'react, useEffect, React Hook, how to use the useEffect react hook'. Separate the keywords by a comma and don't include anything else in your response and lastly sort the keywords by importance in relation to the text as a whole. text: ${text}`,
};
