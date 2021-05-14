import {ITournamentNavigation, ITournamentStepNavigation} from './responses';
import {IProgrammingLanguageNavigation} from '../programming-languages/responses';
import {ITestNavigation} from '../tests/responses';

export interface ITournamentEdition extends ITournamentNavigation{
  steps: ITournamentEditionStep[];
}

export interface ITournamentEditionStep extends ITournamentStepNavigation {
  language: IProgrammingLanguageNavigation;
  tests: ITestNavigation[]
}
