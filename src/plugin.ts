import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
// import fastifyReverseRoutes from 'fastify-reverse-routes';
import dbConn from 'typeorm-fastify-plugin';
import Pug from 'pug';
import i18next from "i18next";
import path from "node:path";

import { dev } from './data-source';
import getHelpers from "./helpers/helpers";
import addRoutes from './routes/index';
import ru from './locales/ru.js';

const setUpLocales = async () => {
  await i18next
    .init({
      lng: 'ru',
      resources: {
        ru
      },
    });
}

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
}

export default async (app: FastifyInstance, _options: unknown) => {
  await registerPlugins(app);

  await setUpLocales();

  addRoutes(app);
  setUpViews(app);
  setUpStaticAssets(app);
  

  return app;
}