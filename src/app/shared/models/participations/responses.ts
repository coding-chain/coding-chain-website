import {IStepNavigation} from '../steps/responses';
import {ITournamentNavigation} from '../tournaments/responses';

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

export interface IParticipationWithFunctions extends IParticipationNavigation {
  functions: string[];
}

export interface IParticipationWithStep extends IParticipationNavigation {
  step: IStepNavigation;
}

export interface IParticipationWithTournament extends IParticipationNavigation {
  tournament: ITournamentNavigation;
}

export interface IParticipationWithTournamentAndStep extends IParticipationWithStep, IParticipationWithTournament {

}


