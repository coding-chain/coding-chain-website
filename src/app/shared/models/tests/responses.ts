import {IProgrammingLanguageNavigation} from '../programming-languages/responses';

export interface ITestNavigation {
  id: string;
  stepId: string;
  outputValidator: string;
  inputGenerator: string;
  score: number;
}
