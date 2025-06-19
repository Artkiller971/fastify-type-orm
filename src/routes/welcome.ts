import fastify, { FastifyInstance } from "fastify";
import fastifyPassport from '@fastify/passport';
import i18next from "i18next";

export default (app: FastifyInstance) => {
  app
    .get('/', async (req, reply) => {
      reply.render('welcome/welcome');
      return reply;
    })
    .get('/protected', { preValidation: app.authenticate },
    (req, reply) => {
      reply.send('This is a protected route and it will be closed when i implement auth...');
      return reply;
    })
}