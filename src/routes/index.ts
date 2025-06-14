import { FastifyInstance } from "fastify";
import welcome from "./welcome";
import users from "./users";

const controllers = [
  welcome,
  users,
];

export default (app: FastifyInstance) => controllers.forEach((f) => f(app));
