import {IRightNavigation, Right} from '../rights/responses';
import {IMemberNavigation, IMemberTeamNavigation, ITeamNavigation} from '../teams/responses';
import {IParticipationNavigation} from '../participations/responses';

export class ConnectedUser {
  id: string;
  username: string;
  email: string;
  rights: IRightNavigation[];
  teams: IMemberTeamNavigation[];

  constructor(obj: Partial<ConnectedUser>) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.rights = obj.rights ?? [];
    this.teams = obj.teams ?? [];
  }

  hasRight(name: Right): boolean {
    return this.rights.some(r => r.name.toLowerCase() === name);
  }

  hasAllRights(names: Right[]): boolean {
    return names.every(r => this.hasRight(r));
  }

  hasSomeRights(names: Right[]): boolean {
    return names.some(r => this.hasRight(r));
  }

  isTeamAdmin(teamId: string): boolean {
    return this.teams.some(t => t.teamId === teamId && t.isAdmin);
  }

  isTeamMember(teamId: string): boolean {
    return this.teams.some(t => t.teamId === teamId);
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

  hasTeamInParticipations(participations: IParticipationNavigation[]): boolean {
    return this.teams.some(t => participations.some(p => p.teamId === t.teamId));
  }

  canLeaveTournament(participations: IParticipationNavigation[]): boolean {
    return this.teams.some(t => participations.some(p => p.teamId === t.teamId && t.isAdmin));
  }

  getTeamsInParticipations(participations: IParticipationNavigation[]): ITeamNavigation[]{
    return this.teams.filter(t => participations.some(p => p.teamId === t.teamId));
  }
}

