import { FastifyInstance, IParams, IBody } from "fastify";
import { validateOrReject, ValidationError} from "class-validator";
import { Label } from "../entities/Label";
import { plainToInstance } from "class-transformer";
import i18next from "i18next";

export default async (app: FastifyInstance) => {
  app
    .get('/labels', { preValidation: app.authenticate }, async (_req, reply) => {
      const labels = await app.orm.getRepository(Label).find();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { preValidation: app.authenticate }, async (_req, reply) => {
      const label = app.orm.getRepository(Label).create();
      reply.render('labels/new', { label });
      return reply;
    })
    .get<{Params: IParams}>
      ('/labels/:id/edit',
      { preValidation: app.authenticate },
      async (req, reply) => {
        const id = parseInt(req.params.id);
        try {
          const label = await app.orm.getRepository(Label).findOneBy({ id });
          if (!label) {
          reply.status(404);
          reply.send('Status does not exist');
          return reply;
        }
          reply.render('labels/edit', { label });
          return reply;
        } catch {
          reply.status(404);
          reply.send('Status does not exist');
          return reply
        }
        
    })
    .post<{Body: IBody, Params: IParams}>('/labels', async (req, reply) => {
      const label = plainToInstance(Label, { ...req.body.data });
      try {
        await validateOrReject(label, { validationError: { target: false }});
        await app.orm.getRepository(Label).insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect('/labels');
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
        
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.status(400);
        reply.render('labels/new', { label: req.body.data , errors });
        return reply;
      }
    })
    .post<{Body: IBody, Params: IParams}>
      ('/labels/:id/edit',
      { preValidation: app.authenticate },
      async (req, reply) => {
        const id = parseInt(req.params.id);
        const label = plainToInstance(Label, { ...req.body.data });
        try {
          await validateOrReject(label, { validationError: { target: false }});
          await app.orm.getRepository(Label).update(id, label);
          req.flash('info', i18next.t('flash.labels.update.success'));
          reply.redirect('/labels');
        } catch (e) {
          const validationErrors = e as ValidationError[];
          const errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          return {
            property: error.property,
            constraints,
            }
          })
        
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.status(400);
        reply.render('labels/edit', { label: req.body.data , errors });
        return reply;
      }
      })
      .post<{Params: IParams}>
        ('/labels/:id/delete',
        { preValidation: app.authenticate },
        async (req, reply) => {
          const id = parseInt(req.params.id)
          try {
            await app.orm.getRepository(Label).delete(id);
            req.flash('info', i18next.t('flash.labels.delete.success'));
            reply.redirect('/labels');
          } catch (e) {
            console.log(e);
            req.flash('error', i18next.t('flash.labels.delete.error'));
            reply.redirect('/labels');
          }

          return reply;
        })
}
