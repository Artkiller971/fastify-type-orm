import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll
} from '@jest/globals';

import _ from 'lodash';
import fastify, { FastifyInstance } from 'fastify';

import init from '../src/plugin';
import { getTestData, prepareData } from './helpers/index';
import { Users } from '../src/entities/User';

describe('Test sessions', () => {
  let app: FastifyInstance;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: true,
    })

    await init(app);
    await app.orm.runMigrations();
  })

  beforeEach(async () => {
    await prepareData(app);
  })


  it('Session page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/session/new',
    });

    expect(response.statusCode).toBe(200);
  })

  it('create', async () => {
    const params = testData.users.existing;
    const response = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const [sessionCookie] = response.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    expect(cookie).not.toBe(null);

    const protectedResponse = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: cookie,
    })

    expect(protectedResponse.statusCode).toBe(200)
  })

  it('create with Error', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(401);
  })

  it('delete', async () => {
    const params = testData.users.existing;
    const responseSignIn = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: params,
      },
    });

    expect(responseSignIn.statusCode).toBe(302);

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };
    const user = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(user).not.toBe(null);

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/session/delete`,
      cookies: cookie,
    });

    const [deleteSessionCookie] = responseDelete.cookies;
    const deletedCookieName = deleteSessionCookie.name
    const deletedCookieValue = deleteSessionCookie.value
    const deletedCookie = { [deletedCookieName]: deletedCookieValue };

    expect(responseDelete.statusCode).toBe(302);

    const protectedRouteResponse = await app.inject({
      method: 'GET',
      url: '/protected',
      cookies: deletedCookie,
    })

    expect(protectedRouteResponse.statusCode).toBe(302)
  })

  afterEach(async () => {
    await app.orm.synchronize(true);
  })

  afterAll(async () => {
    await app.close();
  })
})