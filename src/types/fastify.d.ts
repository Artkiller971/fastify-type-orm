import { NextFunction } from '@fastify/middie';
import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    render(path: string, locals?: object): void;
    locals: object,
  }

  interface PassportUser {
    id: number;
  }

  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => unknown
    userCanEditProfile: (req: FastifyRequest, reply: FastifyReply, next: NextFunction) => unknown
  }
  
  interface IParams {
    [key: string]: string;
  }

  interface IQuerystring {
    [key: string]: string;
  }

  interface IBody {
    [key: string]: string | object;
    data: {
      [key: string]: string,
      labels: object[];
    }
  }
}