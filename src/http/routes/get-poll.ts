import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    try {
      const getPollParams = z.object({
        pollId: z.string().uuid(),
      })

      const { pollId } = getPollParams.parse(request.params)

      const poll = await prisma.poll.findUnique({
        where: {
          id: pollId,
        },
        include: {
          options: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      })

      return reply.send({ poll })
    } catch (error) {
      console.error("Error creating poll:", error);

      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
      } else {
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  })
}
