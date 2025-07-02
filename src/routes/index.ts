import { FastifyInstance } from "fastify";
import welcome from "./welcome";
import users from "./users";
import session from "./session";
import statuses from "./statuses";
import tasks from "./tasks";

const controllers = [
  welcome,
  users,
  session,
  statuses,
  tasks,
];

export default (app: FastifyInstance) => controllers.forEach((f) => f(app));
