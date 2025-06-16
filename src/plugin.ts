import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import dbConn from 'typeorm-fastify-plugin';
import 'reflect-metadata';
// import fastifyMiddie from "@fastify/middie";
import fastifyFormbody from "@fastify/formbody";
import fastifySecureSession from "@fastify/secure-session";
import fastifyPassport from '@fastify/passport';
import { SessionStrategy } from "@fastify/passport/dist/strategies";
import Pug from 'pug';
import qs from 'qs';
import i18next from "i18next";
import path from "node:path";
import * as dotenv from 'dotenv';
import AuthStrategy from "./helpers/AuthStrategy";

import { dev } from './data-source';
import getHelpers from "./helpers/helpers";
import addRoutes from './routes/index';
import ru from './locales/ru.js';
import { Users } from "./entities/User";
import fs from 'node:fs';
import { randomBytes } from 'crypto';

dotenv.config({ path: path.resolve('./.env')});



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
  app.register(dbConn, { connection: dev });
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
  const userDeserializer = async (user: Users) => {
    return await app.orm.getRepository(Users).findOneBy({ id: user.id });
  }
  fastifyPassport.registerUserDeserializer(userDeserializer)
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));

}

export default async (app: FastifyInstance, _options: unknown) => {
  await registerPlugins(app);

  await setUpLocales();

  addRoutes(app);
  setUpViews(app);
  setUpStaticAssets(app);
  addHooks(app);
  

  return app;
}