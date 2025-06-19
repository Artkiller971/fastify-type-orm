import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    render(path: string, locals?: object): void;
    locals: object,
  }

  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => unknown
  }
  
  interface IParams {
    [key: string]: string;
  }

  interface IQueryString {
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