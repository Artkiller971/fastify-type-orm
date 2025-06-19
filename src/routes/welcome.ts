import { FastifyInstance } from "fastify";

export default (app: FastifyInstance) => {
  app
    .get('/', async (_req, reply) => {
      reply.render('welcome/welcome');
      return reply;
    })
    .get('/protected', { preValidation: app.authenticate },
    (_req, reply) => {
      reply.send('This is a protected route and it will be closed when i implement auth...');
      return reply;
    })
}