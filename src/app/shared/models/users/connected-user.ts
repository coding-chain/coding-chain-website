import {IRightNavigation} from "../rights/responses";
import {IMemberNavigation} from "../teams/responses";

export class ConnectedUser {
  id: string;
  username: string;
  email: string;
  rights: IRightNavigation[];
  teams: IMemberNavigation[];

  constructor(obj: Partial<ConnectedUser>) {
    this.id = obj.id
    this.username = obj.username
    this.email = obj.email
    this.rights = obj.rights ?? []
    this.teams = obj.teams ?? []
  }

  isTeamAdmin(teamId: string){
    return this.teams.some(t => t.teamId === teamId && t.isAdmin);
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
