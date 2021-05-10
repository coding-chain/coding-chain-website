export interface ITournamentStepNavigation {
  stepId: string;
  tournamentId: string;
  isOptional: boolean;
  order: number;
}

export interface ITournamentNavigation {
  id: string;
  name: string;
  description:string;
  isPublished: boolean;
  startDate: Date;
  endDate?: Date;
  stepsIds: string[];
}
