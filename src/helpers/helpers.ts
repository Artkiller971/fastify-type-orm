import i18next from 'i18next';
import { FastifyInstance } from 'fastify';
// import _ from 'lodash';

export default (app: FastifyInstance) => ({
  // route(name: string, params = {}) {
  //   return app.reverse(name, params);
  // },
  // _,
  t(key:string) {
    return i18next.t(key);
  },
  getAlertClass(type: string) {
    switch (type) {
      // case 'failure':
      //   return 'danger';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
  formatDate(str: string) {
    const date = new Date(str);
    return date.toLocaleString();
  },
});