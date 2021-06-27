import {cloneStepNavigation, IStepNavigation} from '../steps/responses';

export interface ITournamentStepNavigation extends IStepNavigation {
  stepId: string;
  tournamentId: string;
  isOptional: boolean;
  order: number;
}

export interface ITournamentNavigation {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  startDate: Date;
  endDate?: Date;
  stepsIds: string[];
  participationsIds: string[];
}

export interface ITournamentNavigationWithImage extends ITournamentNavigation {
  image: File;
}

export function cloneTournamentStepNavigation(tournamentStep: ITournamentStepNavigation): ITournamentStepNavigation {
  const stepNav = cloneStepNavigation(tournamentStep);
  return {
    stepId: tournamentStep.stepId,
    tournamentId: tournamentStep.tournamentId,
    isOptional: tournamentStep.isOptional,
    order: tournamentStep.order,
    ...stepNav
  };
}
