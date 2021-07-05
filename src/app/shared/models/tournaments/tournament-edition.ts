import {cloneTournamentStepNavigation, ITournamentNavigation, ITournamentNavigationWithImage, ITournamentStepNavigation} from './responses';
import {cloneStepResume, IStepResume} from '../steps/responses';

export interface ITournamentEdition extends ITournamentNavigationWithImage {
  steps: ITournamentEditionStep[];
}

export interface ITournamentEditionStep extends ITournamentStepNavigation, IStepResume {
}

export function cloneTournamentEditionStep(tournamentEditionStep: ITournamentEditionStep): ITournamentEditionStep {
  const tournamentStep = cloneTournamentStepNavigation(tournamentEditionStep);
  const stepResume = cloneStepResume(tournamentEditionStep);
  return {
    ...tournamentStep,
    ...stepResume
  };
}
