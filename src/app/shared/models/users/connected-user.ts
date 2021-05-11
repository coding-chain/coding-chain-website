import * as _ from 'lodash';
import {RightNavigation} from "../rights/responses";

export class ConnectedUser {
  id: string;
  username: string;
  email: string;
  rights: RightNavigation[];
  teamIds: string[];

  constructor(obj: Partial<ConnectedUser>) {
    this.id = obj.id
    this.username = obj.username
    this.email = obj.email
    this.rights = obj.rights ?? []
    this.teamIds = obj.teamIds ?? []
  }

  isAdmin(): boolean {
    return this.rights.some(r => r.name.toLowerCase() === 'admin');
  }
  isCreator(): boolean {
    return this.rights.some(r => r.name.toLowerCase() === 'creator');
  }
  isUser(): boolean {
    return this.rights.some(r => r.name.toLowerCase() === 'user');
  }
}
