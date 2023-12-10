import { FastifyPluginAsync } from "fastify"
import { getMP3FileByIdHandler, getVideoFileByIdHandler } from "../../../../handlers/file/get.handler.js";

const fileRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/:id/mp3', getMP3FileByIdHandler)
  fastify.get('/:id/video', getVideoFileByIdHandler)
}

export default fileRoute;
