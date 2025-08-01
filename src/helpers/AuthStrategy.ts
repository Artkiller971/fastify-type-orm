import { Strategy } from "@fastify/passport";
import { FastifyRequest, FastifyInstance, IBody } from "fastify";
import { User } from "../entities/User";

export default class AuthStrategy extends Strategy {
  constructor(name: string, public app: FastifyInstance) {
    super(name);
    this.app = app;
  }

  async authenticate (req: FastifyRequest) {
    if (req.isAuthenticated()) {
      return this.pass();
    }

    const body = req.body as IBody;
    if (body) {
      const email = body.data.email
      const password = body.data.password

      const user = await this.app.orm.getRepository(User).findOneBy({ email })
      if (user && user.verifyPassword(password)) {
        return this.success(user);
      }
    }

    return this.fail();
  }
}