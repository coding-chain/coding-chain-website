export interface IStepNavigation {
  id: string;
  languageId: string;
  name: string;
  description: string;
  minFunctionsCount?: number
  maxFunctionsCount?: number
  score: number;
  difficulty: number;
  isPublished: boolean;
  headerCode?: string;
  testIds: string[];
  tournamentIds: string[];
  participationIds: string[];
}
