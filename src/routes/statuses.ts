import { FastifyInstance, IParams, IBody } from "fastify";
import { validateOrReject, ValidationError} from "class-validator";
import { Statuses } from "../entities/Status";
import { plainToInstance } from "class-transformer";
import i18next from "i18next";

export default async (app: FastifyInstance) => {
  app
    .get('/statuses', { preValidation: app.authenticate }, async (_req, reply) => {
      const statuses = await app.orm.getRepository(Statuses).find();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { preValidation: app.authenticate }, async (_req, reply) => {
      const status = app.orm.getRepository(Statuses).create();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get<{Params: IParams}>
      ('/statuses/:id/edit',
      { preValidation: app.authenticate },
      async (req, reply) => {
        const id = parseInt(req.params.id);
        try {
          const status = await app.orm.getRepository(Statuses).findOneBy({ id });
          if (!status) {
          reply.status(404);
          reply.send('Status does not exist');
          return reply;
        }
          reply.render('statuses/edit', { status });
          return reply;
        } catch {
          reply.status(404);
          reply.send('Status does not exist');
          return reply
        }
        
    })
    .post<{Body: IBody, Params: IParams}>('/statuses', async (req, reply) => {
      const status = plainToInstance(Statuses, { ...req.body.data });
      try {
        await validateOrReject(status, { validationError: { target: false }});
        await app.orm.getRepository(Statuses).insert(status);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect('/statuses');
        return reply;
      } catch (e) {
        const validationErrors = e as ValidationError[];
        const errors = validationErrors.map((error) => {
        const constraints = Object.values(error.constraints as object)
        return {
          property: error.property,
          constraints,
          }
        })
        
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.status(400);
        reply.render('statuses/new', { status: req.body.data , errors });
        return reply;
      }
    })
    .post<{Body: IBody, Params: IParams}>
      ('/statuses/:id/edit',
      { preValidation: app.authenticate },
      async (req, reply) => {
        const id = parseInt(req.params.id);
        const status = plainToInstance(Statuses, { ...req.body.data });
        try {
          await validateOrReject(status, { validationError: { target: false }});
          await app.orm.getRepository(Statuses).update(id, status);
          req.flash('info', i18next.t('flash.statuses.update.success'));
          reply.redirect('/statuses');
        } catch (e) {
          const validationErrors = e as ValidationError[];
          const errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          return {
            property: error.property,
            constraints,
            }
          })
        
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.status(400);
        reply.render('statuses/edit', { status: req.body.data , errors });
        return reply;
      }
      })
      .post<{Params: IParams}>
        ('/statuses/:id/delete',
        { preValidation: app.authenticate },
        async (req, reply) => {
          const id = parseInt(req.params.id)
          try {
            await app.orm.getRepository(Statuses).delete(id);
            req.flash('info', i18next.t('flash.statuses.delete.success'));
            reply.redirect('/statuses');
          } catch (e) {
            req.flash('error', i18next.t('flash.statuses.delete.error'));
            console.error(e);
            reply.redirect('/statuses');
          }

          return reply;
        })
}
