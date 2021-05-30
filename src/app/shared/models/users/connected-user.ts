import {IRightNavigation, Right} from '../rights/responses';
import {IMemberTeamNavigation, ITeamNavigation} from '../teams/responses';
import {IParticipationNavigation} from '../participations/responses';
import {ITeamParticipation} from '../teams/team-participation';
import {ObjectUtils} from '../../utils/object.utils';
import {ITournamentResume} from '../tournaments/tournament-resume';

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

  getTeamsInParticipations(participations: IParticipationNavigation[]): ITeamNavigation[] {
    return this.teams.filter(t => participations.some(p => p.teamId === t.teamId));
  }

  getLastTeamsParticipations(tournament: ITournamentResume): ITeamParticipation[] {
    const participationsByTeamId = ObjectUtils.groupBy(tournament.participations, (p) => p.teamId);
    const teamParticipations: ITeamParticipation[] = [];
    participationsByTeamId.forEach((participations, teamId) => {
      const team = this.teams.find(t => t.teamId === teamId);
      if (!team) {
        return;
      }
      const matchingSteps = tournament.steps.filter(s => participations.some(p => p.stepId === s.id && p.tournamentId === tournament.id));
      const lastStep = matchingSteps.sort((s1, s2) => s1.order - s2.order).pop();
      const lastStepParticipation = participations.find(p => p.stepId === lastStep.stepId && p.tournamentId === tournament.id);
      teamParticipations.push({participation: lastStepParticipation, team, step: lastStep});
    });
    return teamParticipations;
  }
}

