import fastify from 'fastify'
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { listPolls } from './routes/getAll-poll'

const app = fastify()

app.register(createPoll)
app.register(getPoll)
app.register(listPolls)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running 🚀')
})