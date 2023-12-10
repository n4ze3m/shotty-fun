import { Job } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { textToSpeech } from "../utils/voice.js";
import { splitTextByTimestamp } from "../utils/video.js";
import { dirname, join } from "path";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { fileURLToPath } from "url";
import { audioToTranscriptAPI } from "../utils/audio-to-text-api.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();
export default async function queueHandler(job: Job) {
  console.log("Processing queue");
  await prisma.$connect();
  try {
    const process = await prisma.video.findUnique({
      where: {
        id: job.data.id,
      },
    });

    if (!process) {
      throw new Error("Process not found");
    }

    await prisma.video.update({
      where: {
        id: job.data.id,
      },
      data: {
        status: "processing",
      },
    });

    const audio = (await textToSpeech(process.script)) as ArrayBuffer;

    const mp3File = await prisma.file.create({
      data: {
        encoding: Buffer.from(audio),
        type: "mp3",
        video_id: process.id,
      },
    });

    const transcript = await audioToTranscriptAPI(Buffer.from(audio));
    const totalDuration =
      transcript.chunks[transcript.chunks.length - 1].timestamp[1];
    const trans = await splitTextByTimestamp(transcript, totalDuration);
    const frame = totalDuration * 30;

    const bundleLocation = join(__dirname, "..", "video");

    const inputProps = {
      script: process.script,
      transcript: trans,
      frame,
      id: process.id,
      audioUrl: `http://localhost:3000/api/v1/file/${mp3File.id}/mp3`,
    };

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "ShortVdo",
      inputProps,
    });
    await renderMedia({
      composition,
      onProgress: ({ progress }) => {
        console.log(`Rendering is ${progress * 100}% complete`);
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: `out/${process.id}.mp4`,
      inputProps,
      chromiumOptions: {
        enableMultiProcessOnLinux: true,
      },
    });

    await prisma.video.update({
      where: {
        id: job.data.id,
      },
      data: {
        assets: trans.videos,
        transcript: trans.chunks,
        status: "done",
      },
    });
    console.log("Done");
  } catch (e) {
    console.log(e);

    await prisma.video.update({
      where: {
        id: job.data.id,
      },
      data: {
        status: "error",
      },
    });
  }
}
