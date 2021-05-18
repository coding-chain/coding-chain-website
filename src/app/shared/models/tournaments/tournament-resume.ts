import {IProgrammingLanguage} from '../programming-languages/responses';
import {IParticipationNavigation} from '../participations/responses';
import {ITournamentNavigation, ITournamentStepNavigation} from './responses';

export interface ITournamentResume extends ITournamentNavigation {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  startDate: Date;
  endDate?: Date;
  steps: ITournamentResumeStep[];
  participations: IParticipationNavigation[];
}

export interface ITournamentResumeStep extends ITournamentStepNavigation {
  id: string;
  isOptional: boolean;
  order: number;
  language: IProgrammingLanguage;
  name: string;
  description: string;
  minFunctionsCount?: number;
  maxFunctionsCount?: number;
  score: number;
  difficulty: number;
}




