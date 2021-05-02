import * as _ from 'lodash';

export class ConnectedUser{
  id: string;
  username: string;
  email: string;

  constructor(obj: Partial<ConnectedUser>) {
    _.assign(this, obj);
  }
  isAdmin(): boolean{
    return false;
  }
}
