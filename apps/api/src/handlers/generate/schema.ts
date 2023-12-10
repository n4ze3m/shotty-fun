import { FastifySchema } from "fastify";

export const generateVideoSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      content: { type: "string" },
      platform: { type: "string", enum: ["tiktok", "linkedin"] },
      type: {
        type: "string",
        enum: ["url", "text"],
      },
    },
    required: ["content", "platform", "type"],
  },
};



export const getVideoInfoByIDSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
};