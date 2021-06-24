import {PublicUser} from '../users/responses';
import {IProgrammingLanguage} from '../programming-languages/responses';
import {ITournamentNavigation} from '../tournaments/responses';
import {IParticipationWithTournamentAndStep} from '../participations/responses';

export interface IPlagiarismFunctionNavigation {
  id: string;
  lastEditorId: string;
  languageId: string;
  participationId: string;
  lastModificationDate: Date;
  code: string;
}
export interface IPlagiarismFunction extends IPlagiarismFunctionNavigation{
  lastEditor: PublicUser;
  language: IProgrammingLanguage;
  participation: IParticipationWithTournamentAndStep;
}

export interface IPlagiarizedFunctionNavigation extends IPlagiarismFunctionNavigation {
  rate: number;
  detectionDate: Date;
}
export interface IPlagiarizedFunction extends IPlagiarizedFunctionNavigation, IPlagiarismFunction {
}

export interface ISuspectFunctionNavigation extends IPlagiarismFunctionNavigation {
  plagiarizedFunctionsIds: string[];
}
export interface ISuspectFunction extends IPlagiarismFunction, ISuspectFunctionNavigation {
  plagiarizedFunctions: IPlagiarizedFunction[];
}


