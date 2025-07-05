import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll
} from '@jest/globals';

import _ from 'lodash';
import fastify, { FastifyInstance } from 'fastify';

import init from '../src/plugin';
import encrypt from '../src/helpers/hash';
import { getTestData, prepareData } from './helpers/index';
import { Users } from '../src/entities/User';

describe('Test users CRUD', () => {
  let app: FastifyInstance;
  const testData = getTestData();
  let cookie;
  let fixtureUser;

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

    const params = testData.users.existing;
    const responseSignIn = await app.inject({
    method: 'POST',
    url: '/session',
    payload: {
      data: params,
    },
  });

    fixtureUser = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };
  })

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
    })

    expect(response.statusCode).toBe(200);
  })

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/new',
    });

    expect(response.statusCode).toBe(200);
  })

  it('edit get', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/users/${fixtureUser.id}/edit`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);

    const responseNonExistent = await app.inject({
      method: 'GET',
      url: `/users/nonExistent/edit`,
      cookies: cookie,
    });

    expect(responseNonExistent.statusCode).toBe(302);
  })

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      password: encrypt(params.password),
    };

    const user = await app.orm.getRepository(Users).findOneBy({ email: params.email});
    expect(user).toMatchObject(expected);
  })

  it('create invalid', async () => {
    const params = testData.users.invalid;
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(400);

  })

  it('edit', async () => {
    const params = testData.users.existing;

    const user = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    const newParams = { ...params, firstName: 'Changed' };

    expect(user).not.toBe(null);

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/users/${user?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedUser = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(updatedUser?.firstName).toBe('Changed');
  })

  it('edit invalid', async () => {
    const params = testData.users.existing;

    const user = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    const newParams = { ...params, firstName: '' };

    expect(user).not.toBe(null);

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/users/${user?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(400);

  })

  it('delete with relations', async () => {
    const params = testData.users.existing;

    const user = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(user).not.toBe(null);

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/users/${user?.id}/delete`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedUser = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(deletedUser).not.toBe(null);
  })

  it('delete no relations', async () => {
    const params = testData.users.existing3;
    const responseSignIn = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: params,
      },
    });

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };

    const user = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(user).not.toBe(null);

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/users/${user?.id}/delete`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedUser = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(deletedUser).toBe(null);
  })

  afterEach(async () => {
    await app.orm.synchronize(true);
  })

  afterAll(async () => {
    await app.close();
  })
})