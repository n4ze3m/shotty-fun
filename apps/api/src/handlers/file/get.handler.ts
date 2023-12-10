import { FastifyReply, FastifyRequest } from "fastify";
import * as fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
type GetFileByIdType = {
  Params: {
    id: string;
  };
};

export const getMP3FileByIdHandler = async (
  request: FastifyRequest<GetFileByIdType>,
  reply: FastifyReply
) => {
  const prisma = request.server.prisma;
  const { id } = request.params;

  const file = await prisma.file.findFirst({
    where: {
      id: id,
    },
  });

  if (!file) {
    return reply.status(404).send({
      error: "File not found",
    });
  }

  reply.header("Content-Type", "audio/mpeg");

  return file.encoding;
};

export const getVideoFileByIdHandler = async (
  request: FastifyRequest<GetFileByIdType>,
  reply: FastifyReply
) => {
  let outPath = "";
  if (process.env.APP_MODE === "dev") {
    outPath = join(__dirname, "..", "..", "..", "out");
  } else {
    outPath = join(__dirname, "..", "..", "out");
  }
  const id = request.params.id;

  const file = await fs.promises.readFile(join(outPath, `${id}.mp4`));

  reply.header("Content-Type", "video/mp4");

  return file;
};
