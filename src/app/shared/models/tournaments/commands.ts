export interface ICreateTournamentCommand {
  name: string;
  description: string;
}

export interface IUpdateTournamentCommand {
  name: string;
  description: string;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface ITournamentStep {
  stepId: string;
  isOptional: boolean;
  order: number;
}

export interface ISetTournamentStepsCommand {
  steps: ITournamentStep[];
}
