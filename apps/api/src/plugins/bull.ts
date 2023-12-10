import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { Queue } from "bullmq";
import { startWorker } from "../queue/worker.js";
const connection = {
  host: process.env.REDIS_HOST!,
  port: 6379,
};

declare module "fastify" {
  interface FastifyInstance {
    queue: Queue;
  }
}

const bullPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const queueName = "shortyy";


  const worker = await startWorker();
  const queue = new Queue(queueName, {
    connection
  });

  server.decorate("queue", queue);

  server.addHook("onClose", () => {
    worker.close();
    queue.close();
  });
});

export default bullPlugin;
