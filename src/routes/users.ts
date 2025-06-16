import { FastifyInstance, IParams, IBody } from "fastify";
import { validateOrReject, ValidationError} from "class-validator";
import { Users } from "../entities/User";
import { plainToInstance } from "class-transformer";
import i18next from "i18next";

export default async (app: FastifyInstance) => {
  app
    .get('/users', async (req, reply) => {
      const users = await app.orm.getRepository(Users).find();
      try {
        reply.render('users/index', { users });
      } catch (e) {
          reply.send('Proebali pohody');
          req.log.error(e);
        }

      return reply;
    })
    .get('/users/new', async (req, reply) => {
      const user = app.orm.getRepository(Users).create();
      reply.render('users/new', { user });
      return reply;
    })
    .get<{Params: IParams}>('/users/:id/edit', async (req, reply) => {
      const id = parseInt(req.params.id);
      const user = await app.orm.getRepository(Users).findOneBy({ id });

      if (!user) {
        reply.send('User does not exist');
        return reply;
      }

      reply.render('users/edit', { user });
      return reply;
    })
    .post<{Body: IBody, Params: IParams}>('/users', async (req, reply) => {
      const user = plainToInstance(Users, req.body.data);
      try {
        await validateOrReject(user, { validationError: { target: false }});
        await app.orm.getRepository(Users).insert(user);
        reply.redirect('/users');
        return reply;
      } catch (e) {
        console.error(e);
        const validationErrors = e as ValidationError[];
        const errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          return {
            property: error.property,
            constraints,
          }
        })

        reply.render('users/new', { user, errors });
        return reply;
      }
    })
    .post<{Body: IBody, Params: IParams}>('/users/:id/edit', async (req, reply) => {
      const user = await app.orm.getRepository(Users).findOneBy({ id: parseInt(req.params.id) });
      if (req.body.data.firstName === 'asd') {
        reply.redirect('/users');
      } else {
        console.log('asdnhansdiunadsijuinjuads')
        reply.render('users/edit', { user })
        return reply.code(422);
      }
    })
}
