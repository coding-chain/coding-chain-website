import {IStepNavigation} from "../steps/responses";

export interface ITournamentStepNavigation extends IStepNavigation{
  stepId: string;
  tournamentId: string;
  isOptional: boolean;
  order: number;
}


export interface ITournamentNavigation {
  id: string;
  name: string;
  description:string;
  isPublished: boolean;
  startDate: Date;
  endDate?: Date;
  stepsIds: string[];
  participationsIds: string[];
}
