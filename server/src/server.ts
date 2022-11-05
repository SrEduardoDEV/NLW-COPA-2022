import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import { pollRoutes } from "./routes/pollRoutes";
import { userRoutes } from "./routes/userRoutes";
import { guessRoutes } from "./routes/guessRoutes";
import { authRoutes } from "./routes/authRoutes";
import { gameRoutes } from "./routes/gameRoutes";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: process.env.SECRET as string,
  });

  await fastify.register(pollRoutes);
  await fastify.register(userRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
