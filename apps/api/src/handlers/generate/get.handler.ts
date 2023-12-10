import { FastifyRequest, FastifyReply } from "fastify";

interface GetVideoInfoByID {
  Params: {
    id: string;
  };
}

export const getVideoInfoByID = async (
  request: FastifyRequest<GetVideoInfoByID>,
  reply: FastifyReply
) => {
  const id = request.params.id;
  const prisma = request.server.prisma;

  const video = await prisma.video.findUnique({
    where: {
      id: id,
    },
  });

  if (!video) {
    reply.status(404).send({
      message: "Video not found",
    });
    return;
  }

  reply.send({
    data: video,
  });
};
