import { Fireworks } from "langchain/llms/fireworks";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const PROMPT = `Your task is to summarize the following context from a website as a {platform} like format. Use the following rules:

- Do not include links or hashtags.
- Make sure the sentences are grammatically correct 
- Make sure the sentences are coherent
- Must be 100% original content
- Only return the script do not return any other information
- Only return text do not return any other information
- Only return max 2 sentences and make it causal and coherent

Context: 

{context}


Script:
`;

const VIDEO_PROMPT = `Your task is to generate a video search query from the following context. Use the following rules:

- Search query must be 100% original content 
- Needs to search high quality videos


Context:

{context}

Search Query:
`;

const openai = new OpenAI(
  {
    modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo-1106",
  },
  {
    basePath: process.env.OPENAI_BASE_PATH,
    baseOptions: {
      headers: {
        "HTTP-Referer": "https://shotty.fun",
        "X-Title": "n4ze3m",
      },
    },
  }
);

const fireworks = new Fireworks({
  modelName:
    process.env.FIREWORKS_MODEL_NAME ||
    "accounts/fireworks/models/mistral-7b-instruct-4k",
});

export const generateVideoScript = async (
  context: string,
  platform: string
) => {
  const prompt = PromptTemplate.fromTemplate(PROMPT);
  let formattedPrompt = await prompt.format({
    context,
    platform,
  });

  if (formattedPrompt.length > 9000) {
    formattedPrompt = formattedPrompt.substring(0, 8000);
  }
  const res = await openai.predict(formattedPrompt);

  return res;
};

export const generateVideoSearchQuery = async (context: string) => {
  const prompt = PromptTemplate.fromTemplate(VIDEO_PROMPT);
  let formattedPrompt = await prompt.format({
    context,
  });

  const res = await fireworks.predict(formattedPrompt);

  return res;
};
