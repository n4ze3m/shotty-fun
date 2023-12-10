import { createClient, ErrorResponse, Videos } from "pexels";
import { generateVideoSearchQuery } from "./ai.js";

const client = createClient(process.env.PEXELS_API!);

export const searchVideo = async (query: string) => {
  const videos = (await client.videos.search({ query, per_page: 1 })) as
    | ErrorResponse
    | Videos;
  if ("error" in videos) {
    throw new Error(videos.error);
  }

  const randomVideo =
    videos.videos[Math.floor(Math.random() * videos.videos.length)];

  return randomVideo.video_files[0].link;
};
const videoUrl = async (text: string) => {
  try {
    const query = await generateVideoSearchQuery(text);
    const url = await searchVideo(query);
    return url;
  } catch (error) {
    console.log(error);
    return "";
  }
};

function splitSentence(sentence: string, totalSeconds: number) {
  const words = sentence.split(" ");
  const chunks = [];
  let currChunk = "";
  let currSeconds = 0;

  const WORD_LENGT = 6;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (currSeconds + word.length / WORD_LENGT > totalSeconds) {
      chunks.push(currChunk);
      currChunk = word;
      currSeconds = word.length / WORD_LENGT;
    } else {
      if (currChunk.length > 0) currChunk += " ";
      currChunk += word;
      currSeconds += word.length / WORD_LENGT;
    }
  }

  chunks.push(currChunk);

  const result = [];
  const seconds = splitTime(chunks.length, totalSeconds);
  for (let i = 0; i < chunks.length; i++) {
    result.push({
      text: chunks[i],
      start: +seconds[i][0].toFixed(2),
      end: +seconds[i][1].toFixed(2),
    });
  }
  return result;
}
function splitTime(length: number, totalSeconds: number) {
  const result = [];
  const segment = totalSeconds / length;

  let start = 0;
  for (let i = 0; i < length; i++) {
    const end = start + segment;
    result.push([start, end]);
    start = end;
  }

  return result;
}

export async function splitTextByTimestamp(
  data: {
    text: string;
    chunks: {
      timestamp: number[];
      text: string;
    }[];
  },
  duration: number
) {
  const videos: {
    start: number;
    end: number;
    video_file: string;
  }[] = [];

  const chunks: {
    start: number;
    end: number;
    text: string;
  }[] = [];

  for (let i = 0; i < data.chunks.length; i++) {
    const chunk = data.chunks[i];
    const start = chunk.timestamp[0];
    const end = chunk.timestamp[1];

    chunks.push({
      start,
      end,
      text: chunk.text,
    });
  }

  const textChunks = splitSentence(data.text, duration);

  for (let i = 0; i < textChunks.length; i++) {
    const text = textChunks[i];
    const start = text.start;
    const end = text.end;

    const video_file = await videoUrl(text.text);

    videos.push({
      start,
      end,
      video_file,
    });
  }

  return {
    chunks,
    videos,
  };
}
