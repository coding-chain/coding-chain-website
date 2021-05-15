import * as _ from 'lodash';

export class BaseEnvironment {
  production = false;
  apiUrl = 'http://localhost:5002/api/v1';
  webStorageTokenKey = 'token';
  rememberMeKey = 'rememberMe';
  themeKey = 'theme';

  constructor(env?: Partial<BaseEnvironment>) {
    _.assign(this, env);
  }
}
