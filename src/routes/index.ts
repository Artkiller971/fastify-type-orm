import { FastifyInstance } from "fastify";
import welcome from "./welcome";
import users from "./users";
import session from "./session";

const controllers = [
  welcome,
  users,
  session
];

export default (app: FastifyInstance) => controllers.forEach((f) => f(app));
