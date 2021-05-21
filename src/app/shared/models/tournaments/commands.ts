import {ITournamentEdition, ITournamentEditionStep} from './tournament-edition';

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

export interface ISetTournamentStepCommand {
  stepId: string;
  isOptional: boolean;
  order: number;
}

export interface ISetTournamentStepsCommand {
  steps: ISetTournamentStepCommand[];
}

export function tournamentEditionStepToSetTournamentStepCommand(tournamentStep: ITournamentEditionStep): ISetTournamentStepCommand {
  return {
    stepId: tournamentStep.stepId,
    isOptional: tournamentStep.isOptional,
    order: tournamentStep.order
  };
}

export function tournamentEditionToUpdateTournamentCommand(tournament: ITournamentEdition): IUpdateTournamentCommand {
  return {
    description: tournament.description,
    endDate: tournament.endDate,
    isPublished: tournament.isPublished,
    name: tournament.name,
    startDate: tournament.startDate
  };
}
