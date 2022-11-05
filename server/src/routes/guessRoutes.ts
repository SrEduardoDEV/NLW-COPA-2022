import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post(
    "/polls/:pollId/games/:gameId/guesses",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { pollId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const poll = await prisma.pool.findUnique({
        where: {
          id: pollId,
        },
      });

      if (!poll) {
        return reply.status(401).send({
          error: "Poll not found",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(401).send({
          error: "Game not found",
        });
      }

      if (game.date < new Date()) {
        return reply.status(401).send({
          error: "You can not send a guess after the game date",
        });
      }

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            userId: request.user.sub,
            poolId: pollId,
          },
        },
      });

      if (!participant) {
        return reply.status(401).send({
          error: "You are not participating in this poll",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          gameId_participantId: {
            gameId,
            participantId: participant.id,
          },
        },
      });

      if (guess) {
        return reply.status(401).send({
          error: "You have already sent a guess in this game on this poll",
        });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
}
