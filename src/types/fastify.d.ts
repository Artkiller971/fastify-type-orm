import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    render(path: string, locals?: object): void; // Define your custom method here
  }
}