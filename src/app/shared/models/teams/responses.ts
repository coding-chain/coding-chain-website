export interface ITeamNavigation {
  id: string;
  name: string;
  membersIds: string[];
}
export interface IMemberNavigation {
  userId: string;
  teamId: string;
  isAdmin: boolean;
  joinDate: Date;
  leaveDate?: Date;
}
