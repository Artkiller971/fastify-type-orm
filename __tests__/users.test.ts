import {
  describe, beforeAll, it, expect, beforeEach, afterEach
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

  it('edit', async () => {
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

    console.log(await app.orm.query('SELECT * FROM users;'));

    expect(responseEdit.statusCode).toBe(302);

    const updatedUser = await app.orm.getRepository(Users).findOneBy({ email: params.email });

    expect(updatedUser?.firstName).toBe('Changed');
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

    console.log(await app.orm.query('SELECT * FROM users;'));

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