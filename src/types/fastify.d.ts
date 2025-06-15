import fastify from 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    render(path: string, locals?: object): void;
  };
  
  interface IParams {
    [key: string]: string;
  }

  interface IQueryString {
    [key: string]: string;
  }

  interface IBody {
    [key: string]: string | object;
    data: {
      [key: string]: string | object[];
    }
  }
}