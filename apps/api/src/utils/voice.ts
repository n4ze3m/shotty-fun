import axios from "axios";

export const textToSpeech = async (text: string) => {
  const apiKey = process.env.ELEVEN_LABS_API;

  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/AZnzlk1XvdvUeBnXmlld`,
    {
      text: text,
    },
    {
      headers: {
        "xi-api-key": apiKey,
      },
      responseType: "arraybuffer",
    }
  );

  return response.data;
};
