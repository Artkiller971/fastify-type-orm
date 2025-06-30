import { FastifyInstance } from "fastify";
import welcome from "./welcome";
import users from "./users";
import session from "./session";
import statuses from "./statuses";

const controllers = [
  welcome,
  users,
  session,
  statuses,
];

export default (app: FastifyInstance) => controllers.forEach((f) => f(app));
