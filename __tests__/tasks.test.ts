import {
  describe, beforeAll, it, expect, beforeEach, afterEach, afterAll
} from '@jest/globals';

import fastify, { FastifyInstance} from 'fastify';

import init from '../src/plugin';
import { getTestData, prepareData } from './helpers/index';
import { Task } from '../src/entities/Task';

describe('test tasks CRUD', () => {
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
      url: '/tasks',
    });

    expect(noCookieResponse.statusCode).toBe(302);

    const cookieResponse = await app.inject({
      method: 'GET',
      url: '/tasks',
      cookies: cookie,
    });

    expect(cookieResponse.statusCode).toBe(200);
  });

  it('edit get', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks/1/edit',
      cookies: cookie,
    })

    expect(response.statusCode).toBe(200);

    const errorResponse = await app.inject({
      method: 'GET',
      url: '/tasks/nonexistent/edit',
      cookies: cookie,
    })

    expect(errorResponse.statusCode).toBe(404);

    const nonexistentResponse = await app.inject({
      method: 'GET',
      url: '/tasks/-2/edit',
      cookies: cookie,
    })

    expect(nonexistentResponse.statusCode).toBe(404);
  })

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks/new',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        data: params,
      },
      cookies: cookie,
    });


    expect(response.statusCode).toBe(302);
    const task = await app.orm.getRepository(Task).findOne({
      where: {
        name: params.name,
      },
      relations: {
        creator: true,
        executor: true,
        status: true,
      }
    })

    const expected = {
      name: params.name,
      description: params.description,
      creator: 2,
      executor: 1,
      status: 1
    }

    const actual = {
      name: task?.name,
      description: task?.description,
      creator: task?.creator.id,
      executor: task?.executor.id,
      status: task?.status.id,
    }
    expect(actual).toMatchObject(expected);
  });

  it('create error', async () => {
    const params = testData.tasks.invalid;
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(400);
  });

  it('edit', async () => {
    const params = testData.tasks.existing;
    const task = await app.orm.getRepository(Task).findOne({
      where: {
        name: params.name
      },
      relations: {
        creator: true,
        executor: true,
        status: true,
      }
    })

    const newParams = { 
      description : task?.description,
      creatorId: task?.creator.id,
      statusId: task?.status.id,
      executorId: task?.executor.id,
      name: 'Changed',
    };

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/tasks/${task?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedStatus = await app.orm.getRepository(Task).findOneBy({ name: newParams.name });

    expect(updatedStatus?.name).toBe('Changed');
  });

  it('edit error', async () => {
    const params = testData.tasks.existing;
    const task = await app.orm.getRepository(Task).findOne({
      where: {
        name: params.name
      },
      relations: {
        creator: true,
        executor: true,
        status: true,
      }
    })

    const newParams = { 
      description : task?.description,
      creatorId: task?.creator.id,
      statusId: task?.status.id,
      executorId: task?.executor.id,
      name: '',
    };

    const responseEdit = await app.inject({
      method: 'POST',
      url: `/tasks/${task?.id}/edit`,
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(400);
  });

  it('delete', async () => {
    const params = testData.tasks.existing;

    const task = await app.orm.getRepository(Task).findOneBy({ name: params.name });

    const responseDelete = await app.inject({
      method: 'POST',
      url: `/tasks/${task?.id}/delete`,
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedStatus = await app.orm.getRepository(Task).findOneBy({ name: params.name });

    expect(deletedStatus).toBe(null);
  });

  afterEach(async () => {
    await app.orm.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });
});