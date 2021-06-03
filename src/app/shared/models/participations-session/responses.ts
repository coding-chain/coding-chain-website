

export interface IParticipationSessionNavigation {
  id: string;
  teamId: string;
  tournamentId: string;
  stepId: string;
  startDate: Date;
  endDate?: Date;
  calculatedScore: number;
  functionsIds: string[];
  passedTestsIds: string[];
  lastError?: string;
  lastOutput?: string;
  processStartTime?: Date;
}

