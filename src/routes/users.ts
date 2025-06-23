import { FastifyInstance, IParams, IBody } from "fastify";
import { validateOrReject, ValidationError} from "class-validator";
import { Users } from "../entities/User";
import { plainToInstance } from "class-transformer";
import i18next from "i18next";
import { QueryFailedError } from "typeorm";
import _ from "lodash";

export default async (app: FastifyInstance) => {
  app
    .get('/users', async (req, reply) => {
      const users = await app.orm.getRepository(Users).find();
      try {
        reply.render('users/index', { users });
      } catch (e) {
          reply.send('error');
          req.log.error(e);
        }

      return reply;
    })
    .get('/users/new', async (_req, reply) => {
      const user = app.orm.getRepository(Users).create();
      reply.render('users/new', { user });
      return reply;
    })
    .get<{Params: IParams}>
      ('/users/:id/edit',
      { preValidation: [ app.userCanEditProfile, app.authenticate ]},
      async (req, reply) => {
        const id = parseInt(req.params.id);
        const data = await app.orm.getRepository(Users).findOneBy({ id });
        const user = _.omit(data, 'password')

        if (!user) {
          reply.send('User does not exist');
          return reply;
        }

        reply.render('users/edit', { user });
        return reply;
    })
    .post<{Body: IBody, Params: IParams}>('/users', async (req, reply) => {
      const user = plainToInstance(Users, { ...req.body.data });
      try {
        await validateOrReject(user, { validationError: { target: false }});
        await app.orm.getRepository(Users).insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/users');
        return reply;
      } catch (e) {
        let errors;
        if (e instanceof QueryFailedError) {
          errors = [{ property: 'email', constraints: ['This email is already in use!']}]
        } else {
          const validationErrors = e as ValidationError[];
          errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          return {
            property: error.property,
            constraints,
            }
          })
        }
        
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data , errors });
        return reply;
      }
    })
    .post<{Body: IBody, Params: IParams}>
      ('/users/:id/edit',
      { preValidation: [ app.userCanEditProfile, app.authenticate ]},
      async (req, reply) => {
        const id = parseInt(req.params.id);
        const user = plainToInstance(Users, { ...req.body.data });
        try {
          await validateOrReject(user, { validationError: { target: false }});
          await app.orm.getRepository(Users).update(id, user);
          req.flash('info', i18next.t('flash.users.update.success'));
          reply.redirect('/users');
        } catch (e) {
        let errors;
        if (e instanceof QueryFailedError) {
          errors = [{ property: 'email', constraints: ['This email is already in use!']}]
        } else {
          const validationErrors = e as ValidationError[];
          errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          return {
            property: error.property,
            constraints,
            }
          })
        }
        
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user: req.body.data , errors });
        return reply;
      }
      })
      .post<{Params: IParams}>
      ('/users/:id/delete',
      { preValidation: [ app.userCanEditProfile, app.authenticate ]},
      async (req, reply) => {
        const id = parseInt(req.params.id)
        try {
          await app.orm.getRepository(Users).delete(id);
          req.logOut();
          req.flash('info', i18next.t('flash.users.delete.success'));
          reply.redirect('/users');
        } catch (e) {
          req.flash('error', i18next.t('flash.users.delete.error'));
          console.error(e);
          reply.redirect('/users');
        }

        return reply;
      })
}
