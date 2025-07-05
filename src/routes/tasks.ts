import { FastifyInstance, IParams, IBody } from "fastify";
import { validateOrReject, ValidationError} from "class-validator";
import { Tasks } from "../entities/Task";
import { Users } from "../entities/User";
import { Statuses } from "../entities/Status";
import { plainToInstance } from "class-transformer";
import i18next from "i18next";

export default async (app: FastifyInstance) => {
  app
    .get('/tasks', { preValidation: app.authenticate }, async (_req, reply) => {
      const tasks = await app.orm.getRepository(Tasks)
      .find({
        relations: {
          creator: true,
          executor: true,
          status: true,
        }
      })
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { preValidation: app.authenticate }, async (_req, reply) => {
      const task = app.orm.getRepository(Tasks).create();
      const users = await app.orm.getRepository(Users).find({
        select: {
          id: true,
          firstName: true,
          lastName: true,
        }
      })
      const statuses = await app.orm.getRepository(Statuses).find({
        select: {
          id: true,
          name: true,
        }
      })
      reply.render('tasks/new', { task, users, statuses })
      return reply;
    })
    .get<{Params: IParams}>('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);
      const task = await app.orm.getRepository(Tasks).findOne({
        where: {
          id
        },
        relations: {
          creator: true,
          executor: true,
          status: true,
        }
      })

      console.log(task);

      if (!task) {
        reply.status(404);
        reply.send('Status does not exist')
      }

      reply.render('tasks/show', { task });
      return reply;
    })
    .get<{Params: IParams}>
      ('/tasks/:id/edit',
      { preValidation: app.authenticate },
      async (req, reply) => {
        const id = parseInt(req.params.id);
        try {
          const task = await app.orm.getRepository(Tasks).findOne({
            where: {
              id,
            },
            relations: {
              executor: true,
              creator: true,
              status: true,
            }
          })
          if (!task) {
          reply.status(404);
          reply.send('Task does not exist');
          return reply;
          }
          console.log(task);
          const users = await app.orm.getRepository(Users).find({
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          })
          const statuses = await app.orm.getRepository(Statuses).find({
            select: {
              id: true,
              name: true,
            }
          })
          reply.render('tasks/edit', { task, users, statuses });
          return reply;
        } catch {
          reply.status(404);
          reply.send('Task does not exist');
          return reply
        }
        
    })
    .post<{Body: IBody, Params: IParams}>('/tasks', async (req, reply) => {
      const creatorId = req.user!.id;
      const rawTask = {
        name: req.body.data.name,
        description: req.body.data.description,
        creator: creatorId,
        executor: parseInt(req.body.data.executorId, 10) || null,
        status: parseInt(req.body.data.statusId, 10) || '',
      }
      const task = plainToInstance(Tasks, rawTask);
      try {
        await validateOrReject(task, { validationError: { target: false }});
        await app.orm.getRepository(Tasks).insert(task);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect('/tasks');
        return reply;
      } catch (e) {
        const validationErrors = e as ValidationError[];
        const errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          let property = error.property;
          if (error.property === 'status' || error.property === 'exectuor') {
            property += 'Id';
          }
          return {
            property,
            constraints,
            }
          })

        const users = await app.orm.getRepository(Users).find({
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        })
        const statuses = await app.orm.getRepository(Statuses).find({
          select: {
            id: true,
            name: true,
          }
        })

        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.status(400);
        reply.render('tasks/new', { task: req.body.data , errors, users, statuses});
        return reply;
      }
    })
    .post<{Body: IBody, Params: IParams}>
      ('/tasks/:id/edit',
      { preValidation: app.authenticate },
      async (req, reply) => {
        const id = parseInt(req.params.id);
        const taskToEdit = await app.orm.getRepository(Tasks).findOneBy({id});
        const rawTask = {
          name: req.body.data.name,
          description: req.body.data.description,
          executor: parseInt(req.body.data.executorId, 10) || null,
          status: parseInt(req.body.data.statusId, 10) || '',
      }
        const task = plainToInstance(Tasks, { ...taskToEdit, ...rawTask });
        try {
          await validateOrReject(task, { validationError: { target: false }});
          await app.orm.getRepository(Tasks).update(id, task);
          req.flash('info', i18next.t('flash.tasks.update.success'));
          reply.redirect('/tasks');
        } catch (e) {
          const validationErrors = e as ValidationError[];
          const errors = validationErrors.map((error) => {
          const constraints = Object.values(error.constraints as object)
          return {
            property: error.property,
            constraints,
            }
          })
          const users = await app.orm.getRepository(Users).find({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            }
          })
          const statuses = await app.orm.getRepository(Statuses).find({
            select: {
              id: true,
              name: true,
            }
          })
          req.flash('error', i18next.t('flash.tasks.update.error'));
          reply.status(400);
          reply.render('tasks/edit', { task: req.body.data , errors, users, statuses });
          return reply;
        }
      })
      .post<{Params: IParams}>
        ('/tasks/:id/delete',
        { preValidation: app.authenticate },
        async (req, reply) => {
          const id = parseInt(req.params.id)
          try {
            await app.orm.getRepository(Tasks).delete(id);
            req.flash('info', i18next.t('flash.tasks.delete.success'));
            reply.redirect('/tasks');
          } catch (e) {
            req.flash('error', i18next.t('flash.tasks.delete.error'));
            console.log(e);
            reply.redirect('/tasks');
          }

          return reply;
        })
}
