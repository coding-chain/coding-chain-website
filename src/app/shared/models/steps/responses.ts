export interface IStepNavigationNavigation {
  id: string;
  languageId: string;
  name: string;
  description: string;
  minFunctionsCount?: number
  maxFunctionsCount?: number
  score: number;
  difficulty: number;
  headerCode?:string;
  testIds: string[];
  tournamentIds: string[];
  participationIds: string[];
}
