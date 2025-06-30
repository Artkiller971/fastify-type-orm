import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll
} from '@jest/globals';

import fastify, { FastifyInstance} from 'fastify';

import init from '../src/plugin';
import { getTestData, prepareData } from './helpers/index';
import { Statuses } from '../src/entities/Status';

describe('test statuses CRUD', () => {
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
      url: '/statuses',
    });

    expect(noCookieResponse.statusCode).toBe(302);

    const cookieResponse = await app.inject({
      method: 'GET',
      url: '/statuses',
      cookies: cookie,
    });

    expect(cookieResponse.statusCode).toBe(200);
  });

  it('edit get', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses/1/edit',
      cookies: cookie,
    })

    expect(response.statusCode).toBe(200);

    const errorResponse = await app.inject({
      method: 'GET',
      url: '/statuses/nonexistent/edit',
      cookies: cookie,
    })

    expect(errorResponse.statusCode).toBe(404);

    const nonexistentResponse = await app.inject({
      method: 'GET',
      url: '/statuses/-2/edit',
      cookies: cookie,
    })

    expect(nonexistentResponse.statusCode).toBe(404);
  })

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses/new',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: '/statuses',
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: 'Done',
    };
    const status = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });
    expect(status).toMatchObject(expected);
  });

  it('create error', async () => {
    const params = testData.statuses.invalid;
    const response = await app.inject({
      method: 'POST',
      url: '/statuses',
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(400);
  });

  it('edit', async () => {
    const params = testData.statuses.existing;
    const status = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });

    const newParams = { name: 'Changed' };

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/statuses/${status?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedStatus = await app.orm.getRepository(Statuses).findOneBy({ name: newParams.name });

    expect(updatedStatus?.name).toBe('Changed');
  });

  it('edit error', async () => {
    const params = testData.statuses.existing;
    const status = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });

    const newParams = { name: '' };

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/statuses/${status?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(400);
  });

  it('delete no relations', async () => {
    const params = testData.statuses.existing2;

    const status = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/statuses/${status?.id}/delete`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedStatus = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });

    expect(deletedStatus).toBe(null);
  });

  // it('delete with relations', async () => {
  //   const params = testData.statuses.existing;

  //   const status = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });

  //   const responseDelete = await app.inject({
  //     method: 'DELETE',
  //     url: app.reverse('statusDelete', { id: status.id }),
  //     cookies: cookie,
  //   });

  //   expect(responseDelete.statusCode).toBe(302);

  //   const deletedStatus = await app.orm.getRepository(Statuses).findOneBy({ name: params.name });

  //   expect(deletedStatus).toMatchObject(status);
  // });

  afterEach(async () => {
    await app.orm.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });
});