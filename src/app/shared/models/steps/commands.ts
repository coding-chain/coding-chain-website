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
  score: number;
}
