import { getChatCompletionFromText } from "@app/open-ai";
import { getAllSupabaseDocs } from "@app/supabase";

const _MAX_RECURSION_DEPTH = 2;

export const getRecursiveAiResponse = async (
  query: string,
  contextArray: string[],
  currentDepth = 0
): Promise<string> => {
  const context = contextArray.join(". ");

  const aiResponse = await getChatCompletionFromText(
    `use text="${context}" to answer '${query}', consider the previous text between quotes to be absolutely true and don't use any information that wasn't provided.`
  );
  // const allSupaBaseDocs = await getAllSupabaseDocs();
  // // const aiResponseWithAllDocs = await getChatCompletionFromText(
  // //   `use '${allSupaBaseDocs.join(
  // //     " "
  // //   )}' to answer '${query}', format your answer as a reply in a chat.`
  // // );

  // console.log({ context, aiResponseWithAllDocs, aiResponse, allSupaBaseDocs });
  // return aiResponseWithAllDocs;
  console.log({ aiResponse, context });
  return aiResponse;
  if (currentDepth === 2 || currentDepth > _MAX_RECURSION_DEPTH) {
    return aiResponse;
  }

  // !! ai has determined that the context given is not enough to answer the query
  if (
    aiResponse === "no-info" ||
    aiResponse.toLocaleLowerCase().includes("sorry") ||
    aiResponse.toLocaleLowerCase().includes("no-info")
  ) {
    // use all documents in the database as context
    const allSupaBaseDocs = await getAllSupabaseDocs();
    return await getRecursiveAiResponse(
      query,
      allSupaBaseDocs,
      currentDepth + 1
    );
  }

  return aiResponse;
};
