// ESM
import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import routes from './src/routes/index.js';

// Load environment variables from .env file
dotenv.config();

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true
});

// Register CORS
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

fastify.register(routes);

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

fastify.listen({ port, host }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server is now listening on ${address}`)
  console.log(`📧 Email API available at ${address}/emails`)
  console.log(`🤖 AI Email generation at ${address}/generate-email`)
  console.log(`📤 Send emails at ${address}/send-email`)
})
