import { FastifyInstance, FastifyReply, FastifyRequest, IParams } from "fastify"
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import dbConn from 'typeorm-fastify-plugin';
import 'reflect-metadata';
// import fastifyMiddie from "@fastify/middie";
import fastifyFormbody from "@fastify/formbody";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from '@fastify/passport';
import Pug from 'pug';
import qs from 'qs';
import i18next from "i18next";
import path from "node:path";
import * as dotenv from 'dotenv';
import AuthStrategy from "./helpers/AuthStrategy";

import dbConfigs from './data-source';
import getHelpers from "./helpers/helpers";
import addRoutes from './routes/index';
import ru from './locales/ru';
import { User } from "./entities/User";
import { NextFunction } from "@fastify/middie";
import './helpers/query';

dotenv.config({ path: path.resolve('./.env')});

const mode = process.env.NODE_ENV || 'development';

const setUpLocales = async () => {
  await i18next
    .init({
      lng: 'ru',
      resources: {
        ru
      },
    });
}

const addHooks = (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });
};

const setUpViews = (app: FastifyInstance) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename: string) => `/assets/${filename}`,
    },
    templates: path.resolve(path.join('./src', 'views')),
  });

  app.decorateReply('render', function render(viewPath: string, locals: object) {
    this.view(viewPath, { ...locals, reply:this })
  })
};

const setUpStaticAssets = (app: FastifyInstance) => {
  const staticPath = path.join(__dirname, 'static');
  app.register(fastifyStatic, {
    root: staticPath,
    prefix: '/assets/',
  });
};

const registerPlugins = async (app: FastifyInstance) => {
  app.register(dbConn, { connection: dbConfigs[mode]});
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifySecureSession, {
    key: Buffer.from(process.env.SESSION_KEY),
    cookie: {
      path: '/'
    }
  })
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  fastifyPassport.use(new AuthStrategy('auth', app));
  const userDeserializer = async (user: User) => {
    return await app.orm.getRepository(User).findOneBy({ id: user.id });
  }
  fastifyPassport.registerUserDeserializer(userDeserializer)
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));

  app.decorate('authenticate', (...args) => {
    return (fastifyPassport.authenticate(
    'auth',
    {
      failureRedirect: '/',
      failureFlash: i18next.t('flash.authError'),
    }
  ).call(app, ...args))});

  app.decorate('userCanEditProfile', (req: FastifyRequest, reply: FastifyReply, next: NextFunction) => {
    const id = req.user ? req.user.id : null;
    const params = req.params as IParams;
    const paramsId = params.id;
    if (id !== parseInt(paramsId, 10)) {
      req.flash('error', i18next.t('flash.users.authError'));
      reply.redirect('/users');
    }

    next();
  })
}

export default async (app: FastifyInstance, _options?: unknown) => {
  await registerPlugins(app);

  await setUpLocales();

  addRoutes(app);
  setUpViews(app);
  setUpStaticAssets(app);
  addHooks(app);
  

  return app;
}