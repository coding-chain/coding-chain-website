import {ITournamentStepNavigation} from './responses';
import {IProgrammingLanguageNavigation} from '../programming-languages/responses';
import {ITestNavigation} from '../tests/responses';

export interface ITournamentEdition {
  id: string;
  name: string;
  description: string;
  isPublished: boolean;
  startDate: Date;
  endDate?: Date;
  steps: ITournamentEditionStep[];
}

export interface ITournamentEditionStep extends ITournamentStepNavigation {
  id: string;
  isOptional: boolean;
  order: number;
  language: IProgrammingLanguageNavigation;
  name: string;
  description: string;
  minFunctionsCount?: number
  maxFunctionsCount?: number
  score: number;
  difficulty: number;
  tests: ITestNavigation[]
}
