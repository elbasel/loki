type TemplateVariable = {
  key: string;
  value: string;
};
// TODO pull prompts from database, mdx, or api
export const promptTemplates = {
  // no template variables
  noContextAvailable:
    "I'm sorry but I don't have any context available to answer your query, please try again later.",
  // pass {context: string, query: string} as templateArgs
  answerBasedOnContext:
    "Only base your answers on the following context to answer the query, in case you need to know more about the context, please ask me to show you the context, otherwise say 'I don't know', never provide information that is not in the context and please always output your answer in markdown format. context: ${context} query: ${query}",
  // pass {text: string} as templateArgs
  getMostImportantKeywords:
    "Extract the most important keywords out of the following text so that if used in a search engine it would return the most relevant results, as an example if provided by 'how does the useEffect hook work in react' then you should reply with 'react, useEffect, React Hook, how to use the useEffect react hook'. Separate the keywords by a comma and don't include anything else in your response and lastly sort the keywords by importance in relation to the text as a whole. text: ${text}",
};

export class PromptGenerator {
  // match ${varName} in template
  static _getTemplateVariables(template: string): string[] {
    if (this !== PromptGenerator) throw Error("Use PromptGenerator.new");
    const variables: string[] = [];
    const regex = /\${(.*?)}/g;
    const matches = [...template.matchAll(regex)];
    if (matches.length === 0) return variables;

    matches.forEach((match) => {
      variables.push(match[1]);
    });
    return variables;
  }
  static _getGenerator(template: string, templateVariables: string[]) {
    if (this !== PromptGenerator) throw Error("Use PromptGenerator.new");
    const templateVariablesUnsafeObject: any = {};

    for (const v of templateVariables) {
      if (!v) continue;
      templateVariablesUnsafeObject[v] = null;
    }

    const generator = (templateArgs: any): string => {
      let prompt = template;
      for (const key in templateArgs) {
        if (!key) continue;
        const value = templateArgs[key];
        prompt = prompt.replaceAll("${" + key + "}", value);
      }
      return prompt;
    };
    generator.varNames = templateVariables;
    return generator;
  }

  static new(template: string) {
    const generatorArgs: any = {};
    const templateVariables: string[] =
      PromptGenerator._getTemplateVariables(template);

    for (const v of templateVariables) {
      if (!v) continue;
      generatorArgs[v] = null;
    }
    const generator = PromptGenerator._getGenerator(
      template,
      templateVariables
    );
    return generator;
  }
}
