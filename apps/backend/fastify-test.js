const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const port = 4000
const host = '127.0.0.1'

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    console.error('Fastify failed to start:', err.message)
    process.exit(1)
  }
  console.log(`Fastify server listening at ${address}`)
})
