import { getChatCompletionFromText } from "@app/open-ai/actions";
import { createClient } from "@supabase/supabase-js";

const _SUPABASE_CLIENT = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_PRIVATE_KEY || ""
);

const _MAX_RECURSION_DEPTH = 2;

export const getRecursiveAiResponse = async (
  query: string,
  contextArray: string[],
  currentDepth = 0
): Promise<string> => {
  const context = contextArray.join(" ");

  const aiResponse = await getChatCompletionFromText(
    `use '${context}' to answer '${query}' if you need more information to answer the query, please respond only with 'no-info' and nothing else!`
  );
  console.log({ aiResponse });
  if (currentDepth === 2 || currentDepth > _MAX_RECURSION_DEPTH) {
    return aiResponse;
  }

  // !! ai has determined that the context given is not enough to answer the query
  if (
    aiResponse === "no-info" ||
    aiResponse.toLocaleLowerCase().includes("sorry")
  ) {
    // use all documents in the database as context
    const supabaseResponseAllDocs = await _SUPABASE_CLIENT
      .from("documents")
      .select();
    if (supabaseResponseAllDocs.error) throw supabaseResponseAllDocs.error;
    const allSupaBaseDocs: any[] = supabaseResponseAllDocs.data;

    const fallbackContext = [...allSupaBaseDocs.map((d) => d.content)];
    return await getRecursiveAiResponse(
      query,
      fallbackContext,
      currentDepth + 1
    );
  }

  return aiResponse;
};
