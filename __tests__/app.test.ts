import {
  describe, beforeAll, it, expect,
} from '@jest/globals';

import fastify, { FastifyInstance } from 'fastify';
import init from '../src/plugin';

describe('requests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: true
    })

    await init(app);
  })

  it('GET 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
  })

  it('GET 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/wrong-path',
    });
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
})