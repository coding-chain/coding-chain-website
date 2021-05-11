import {IProgrammingLanguageNavigation} from "../programming-languages/responses";

export class TournamentResume {
  id: string;
  name: string;
  description:string;
  isPublished: boolean;
  startDate: Date;
  endDate?: Date;
  steps: TournamentResumeStep[];

  constructor(obj: Partial<TournamentResume>) {
    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    this.isPublished = obj.isPublished;
    this.startDate = obj.startDate;
    this.endDate = obj.endDate;
    this.steps = obj.steps ?? [];
  }
}

export class TournamentResumeStep{
  id: string;
  isOptional: boolean;
  order: number;
  language: IProgrammingLanguageNavigation;
  name: string;
  description: string;
  minFunctionsCount?: number
  maxFunctionsCount?: number
  teamIds: string[];
  score: number;
  difficulty: number;

  constructor(obj: Partial<TournamentResumeStep>) {
    this.id = obj.id;
    this.isOptional = obj.isOptional;
    this.order = obj.order;
    this.language = obj.language;
    this.name = obj.name;
    this.description = obj.description;
    this.minFunctionsCount = obj.minFunctionsCount;
    this.maxFunctionsCount = obj.maxFunctionsCount;
    this.teamIds = obj.teamIds ?? [];
    this.score = obj.score;
    this.difficulty = obj.difficulty;
  }
}
//
//
// export  interface IParticipationNavigation {
//   id: string;
//   teamId: string;
//   tournamentId: string;
//   stepId: string;
//   startDate: Date;
//   endDate: Date;
//   calculatedScore: number;
//   functionsIde: string[];
// }

