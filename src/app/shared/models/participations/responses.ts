export interface IParticipationNavigation {
  id: string;
  teamId: string;
  tournamentId: string;
  stepId: string;
  startDate: Date;
  endDate?: Date;
  calculatedScore: number;
  functionsIds: string[];
}

export interface IParticipation extends IParticipationNavigation{
  functions: string[];
}
