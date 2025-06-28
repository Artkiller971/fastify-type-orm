import fs from 'node:fs';
import path from 'node:path';
import { FastifyInstance } from "fastify";
import { Users } from '../../src/entities/User';

const getFixturePath = (filename) => path.resolve('__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app: FastifyInstance) => {
  await app.orm.getRepository(Users).insert(getFixtureData('users.json'));
}
