import fs from 'node:fs';
import path from 'node:path';
import { FastifyInstance } from "fastify";
import { User } from '../../src/entities/User';
import { Status } from '../../src/entities/Status';
import { Task } from '../../src/entities/Task';

const getFixturePath = (filename) => path.resolve('__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app: FastifyInstance) => {
  await app.orm.getRepository(User).insert(getFixtureData('users.json'));
  await app.orm.getRepository(Status).insert(getFixtureData('statuses.json'));
  await app.orm.getRepository(Task).insert(getFixtureData('tasks.json'));
}
