import {BaseEnvironment} from './base-environment';

export const environment = new BaseEnvironment({
  production: true,
  apiUrl: '/api'
});
