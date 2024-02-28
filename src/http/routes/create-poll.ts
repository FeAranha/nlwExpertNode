import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
    try {
      const createPollBody = z.object({
        title: z.string(),
        options: z.array(z.string()),
      })

      const { title, options } = createPollBody.parse(request.body)

      const poll = await prisma.poll.create({
        data: {
          title,
          options: {
            createMany: {
              data: options.map((option) => {
                return {
                  title: option,
                }
              })
            }
          }
        }
      })

      return reply.status(201).send({ pollId: poll.id })
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
