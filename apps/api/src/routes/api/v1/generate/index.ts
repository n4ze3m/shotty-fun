import { FastifyPluginAsync } from "fastify";
import {
  generateVideoSchema,
  getVideoInfoByIDSchema,
} from "../../../../handlers/generate/schema.js";
import { generateVideo } from "../../../../handlers/generate/post.handler.js";
import { getVideoInfoByID } from "../../../../handlers/generate/get.handler.js";

const generate: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: generateVideoSchema,
      bodyLimit: 50 * 1024 * 1024,
    },
    generateVideo
  );

  fastify.get(
    "/:id/info",
    {
      schema: getVideoInfoByIDSchema,
    },
    getVideoInfoByID
  );
};

export default generate;
