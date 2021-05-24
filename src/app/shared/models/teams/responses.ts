import {PublicUser} from '../users/responses';
import {IAddMemberToTeamCommand, ICreateTeamCommand} from './commands';
import {ConnectedUser} from '../users/connected-user';
import {IParticipationNavigation} from '../participations/responses';

export interface ITeamNavigation {
  id: string;
  name: string;
  membersIds: string[];
  participationIds: string[];
}

export interface IMemberNavigation {
  userId: string;
  teamId: string;
  isAdmin: boolean;
  joinDate: Date;
  leaveDate?: Date;
}


export interface IMemberTeamNavigation extends IMemberNavigation, ITeamNavigation{
}

export interface IMemberResume extends IMemberNavigation, PublicUser {

}

export interface ITeamWithMembersResume extends ITeamNavigation {
  members: IMemberResume[];
}
export interface ITeamWithParticipations extends ITeamNavigation{
  participations: IParticipationNavigation[];
}



export function teamNavToTeamCommand(team: ITeamNavigation): ICreateTeamCommand {
  return {name: team.name};
}

export function memberNavToAddMemberCommand(member: IMemberNavigation): IAddMemberToTeamCommand {
  return {memberId: member.userId};
}

export function connectedUserWithTeamToMember(user: ConnectedUser, team: ITeamNavigation): IMemberResume {
  return {
    userId: user.id,
    isAdmin: true,
    teamId: team.id,
    ...user
  } as unknown as IMemberResume;
}

export function cloneMemberResume(member: IMemberResume): IMemberResume {
  return {
    userId: member.userId,
    teamId: member.teamId,
    id: member.id,
    isAdmin: member.isAdmin,
    email: member.email,
    username: member.username,
    joinDate: member.joinDate,
    leaveDate: member.leaveDate,
    teamIds: member.teamIds,
    rightIds: member.rightIds
  };
}
