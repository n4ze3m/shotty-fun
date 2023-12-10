import { FastifyRequest, FastifyReply } from "fastify";
import { urlToText } from "../../utils/html.js";
import { generateVideoScript } from "../../utils/ai.js";

interface GenerateRequestBody {
  Body: {
    content: string;
    platform: "tiktok" | "linkedin" | "instagram";
    type: "url" | "text";
  };
}

export const generateVideo = async (
  request: FastifyRequest<GenerateRequestBody>,
  reply: FastifyReply
) => {
  try {
    const { content, platform, type } = request.body;
    const prisma = request.server.prisma;

    let text = "";

    if (type === "url") {
      text = await urlToText(content);
    } else {
      text = content;
    }
    const script = await generateVideoScript(text, platform);

    const process = await prisma.video.create({
      data: {
        website: content,
        script: script,
        platform,
        type,
      },
    });

    await request.server.queue.add("generate", {
      id: process.id,
    });
    return {
      message: "Generating video",
      video_id: process.id,
      status: "pending",
    };
  } catch (error: any) {
    console.log(error);
    return reply.status(500).send({
      error: error?.message || "Internal Server Error",
    });
  }
};
