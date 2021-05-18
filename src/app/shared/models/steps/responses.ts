import {IProgrammingLanguage} from '../programming-languages/responses';
import {cloneTestNavigation, ITestNavigation} from '../tests/responses';

export interface IStepNavigation {
  id: string;
  languageId: string;
  name: string;
  description: string;
  minFunctionsCount?: number;
  maxFunctionsCount?: number;
  score: number;
  difficulty: number;
  isPublished: boolean;
  headerCode?: string;
  testIds: string[];
  tournamentIds: string[];
  participationIds: string[];
}

export interface IStepResume extends IStepNavigation {
  language: IProgrammingLanguage;
  tests: ITestNavigation[];
}

export function cloneStepNavigation(s: IStepNavigation): IStepNavigation {
  return {
    minFunctionsCount: s.minFunctionsCount,
    maxFunctionsCount: s.maxFunctionsCount,
    id: s.id,
    difficulty: s.difficulty,
    name: s.name,
    description: s.description,
    testIds: s.testIds,
    languageId: s.languageId,
    score: s.score,
    headerCode: s.headerCode,
    isPublished: s.isPublished,
    participationIds: s.participationIds,
    tournamentIds: s.tournamentIds
  };
}

export function cloneStepResume(s: IStepResume): IStepResume {
  const sNav = cloneStepNavigation(s);
  return {
    language: s.language,
    tests: s.tests.map(t => cloneTestNavigation(t)),
    ...sNav
  };
}
