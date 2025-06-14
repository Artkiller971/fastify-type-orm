import { FastifyInstance } from "fastify";
import { Users } from "../entities/User";

export default async (app: FastifyInstance) => {
  app
    .get('/users', async (req, reply) => {
      const user = {
        firstName: 'asd',
        lastName: 'asdf',
        email: 'asd@asd.asd',
        password: 'zxc123'
      };
      try {
        await app.orm.getRepository(Users).insert(user);
        reply.send('Successful request pagger manz!');
      } catch (e) {
          reply.send('Proebali pohody');
          req.log.error(e);
        }

      return reply;
    })
}
