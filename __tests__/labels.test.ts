import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll
} from '@jest/globals';

import fastify, { FastifyInstance} from 'fastify';

import init from '../src/plugin';
import { getTestData, prepareData } from './helpers/index';
import { Label } from '../src/entities/Label';

describe('test labels CRUD', () => {
  let app: FastifyInstance;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: true
    });

    await init(app);
    await app.orm.runMigrations();
  });

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

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };
  });

  it('index', async () => {
    const noCookieResponse = await app.inject({
      method: 'GET',
      url: '/labels',
    });

    expect(noCookieResponse.statusCode).toBe(302);
    const cookieResponse = await app.inject({
      method: 'GET',
      url: '/labels',
      cookies: cookie,
    });

    expect(cookieResponse.statusCode).toBe(200);
  });

  it('edit get', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/labels/1/edit',
      cookies: cookie,
    })

    expect(response.statusCode).toBe(200);

    const errorResponse = await app.inject({
      method: 'GET',
      url: '/labels/nonexistent/edit',
      cookies: cookie,
    })

    expect(errorResponse.statusCode).toBe(404);

    const nonexistentResponse = await app.inject({
      method: 'GET',
      url: '/labels/-2/edit',
      cookies: cookie,
    })

    expect(nonexistentResponse.statusCode).toBe(404);
  })

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/labels/new',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: '/labels',
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const expected = 'New label 1';
    const label = await app.orm.getRepository(Label).findOneBy({ name: params.name });
    expect(label!.name).toBe(expected);
  });

  it('create error', async () => {
    const params = testData.labels.invalid;
    const response = await app.inject({
      method: 'POST',
      url: '/labels',
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(400);
  });

  it('edit', async () => {
    const params = testData.labels.existing;
    const label = await app.orm.getRepository(Label).findOneBy({ name: params.name });

    const newParams = { name: 'Changed' };

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/labels/${label?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedStatus = await app.orm.getRepository(Label).findOneBy({ name: newParams.name });

    expect(updatedStatus?.name).toBe('Changed');
  });

  it('edit error', async () => {
    const params = testData.labels.existing;
    const label = await app.orm.getRepository(Label).findOneBy({ name: params.name });

    const newParams = { name: '' };

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/labels/${label?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(400);
  });

  it('delete no relations', async () => {
    const params = testData.labels.existing2;

    const label = await app.orm.getRepository(Label).findOneBy({ name: params.name });

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/labels/${label?.id}/delete`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedStatus = await app.orm.getRepository(Label).findOneBy({ name: params.name });

    expect(deletedStatus).toBe(null);
  });

  it('delete with relations', async () => {
    const params = testData.labels.existing;

    const label = await app.orm.getRepository(Label).findOneBy({ name: params.name });

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/labels/${label?.id}/delete`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedStatus = await app.orm.getRepository(Label).findOneBy({ name: params.name });

    expect(deletedStatus).not.toBe(null);
  });

  afterEach(async () => {
    await app.orm.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });
});