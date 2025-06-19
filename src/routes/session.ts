import { FastifyInstance, IParams, IBody } from "fastify";
import { validateOrReject, ValidationError} from "class-validator";
import { Users } from "../entities/User";
import { plainToInstance } from "class-transformer";
import  fastifyPassport  from "@fastify/passport"
import i18next from "i18next";

export default async (app: FastifyInstance) => {
  app
    .get('/session/new', async (req, reply) => {
      const signInForm = {}
      reply.render('session/new', { signInForm });
      return reply;
    })
    .post('/session', fastifyPassport.authenticate('auth', async (req, reply, err, user) => {
      if (err) {
        reply.send('ERROR');
      }

      if (!user) {
        const body = req.body as IBody;
        const signInForm = body.data;

        const errors = [{ property: 'email', constraints: ['Неправильный email или пароль'] }];

        reply.render('session/new', { signInForm, errors });
        return reply;
      }

      await req.logIn(user);
      req.flash('success', i18next.t('flash.session.create.success'));
      reply.redirect('/users')
      return reply;
    }))
    .post<{Body: IBody, Params: IParams}>('/session/delete', async (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect('/');
    })
}