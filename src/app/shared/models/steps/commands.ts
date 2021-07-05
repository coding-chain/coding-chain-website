import {ITestNavigation} from '../tests/responses';
import {IStepResume} from './responses';

export interface ICreateStepCommand {
  languageId: string;
  headerCode: string;
  name: string;
  description: string;
  score: number;
  difficulty: number;
  minFunctionsCount?: number;
  maxFunctionsCount?: number;
}

export interface IUpdateStepCommand {
  headerCode: string;
  name: string;
  description: string;
  minFunctionsCount?: number;
  maxFunctionsCount?: number;
  score: number;
  difficulty: number;
  languageId: string;
}

export interface IAddTestCommand {
  outputValidator: string;
  inputGenerator: string;
  name: string;
  score: number;
}

export interface ISetTestCommand {
  id?: string;
  name: string;
  outputValidator: string;
  inputGenerator: string;
  score: number;
}

export interface ISetTestsCommand {
  tests: ISetTestCommand[];
}

export function testNavigationToSetTestCommand(test: ITestNavigation): ISetTestCommand {
  return {
    id: test.id,
    name: test.name,
    outputValidator: test.outputValidator,
    score: test.score,
    inputGenerator: test.inputGenerator
  };
}

export function stepResumeToSetTestCommand(step: IStepResume): ISetTestsCommand {
  return {
    tests: step.tests.map(t => testNavigationToSetTestCommand(t)),
  };
}

export function stepResumeToUpdateStepCommand(step: IStepResume): IUpdateStepCommand {
  return {
    minFunctionsCount: step.minFunctionsCount,
    maxFunctionsCount: step.maxFunctionsCount,
    score: step.score,
    headerCode: step.headerCode,
    languageId: step.language.id,
    difficulty: step.difficulty,
    name: step.name,
    description: step.description
  };
}
