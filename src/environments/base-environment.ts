import * as _ from 'lodash';

export class BaseEnvironment {
  production = false;
  apiUrl = 'http://localhost:5002/api/v1';
  webStorageTokenKey = 'token';
  rememberMeKey = 'rememberMe';
  themeKey = 'theme';
  realTimeConnectionTimeout: number = 60 * 60 * 1000;

  constructor(env?: Partial<BaseEnvironment>) {
    _.assign(this, env);
  }
}
