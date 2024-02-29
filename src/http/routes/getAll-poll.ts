import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

const listPollsParams = z.object({
  filter: z.string().optional(),
});

export async function listPolls(app: FastifyInstance) {
  app.get('/allpolls', async (request, reply) => {
    try {
      const { filter } = listPollsParams.parse(request.query);

      const where = filter ? { title: { contains: filter } } : {};

      const polls = await prisma.poll.findMany({
        where,
        include: {
          options: {
            select: {
              id: true,
              title: true,
            }
          },
        },
      });

      return reply.send({ polls });
    } catch (error) {
      console.error("Error listing polls:", error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
