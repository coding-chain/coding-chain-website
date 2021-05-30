import {IParticipationNavigation} from '../participations/responses';
import {AppFunction} from '../function-session/responses';
import {IUserSessionNavigation} from '../user-session/responses';
import {IStepNavigation} from '../steps/responses';
import {IProgrammingLanguage} from '../programming-languages/responses';
import {PublicUser} from '../users/responses';

export interface IParticipationSession extends IParticipationNavigation {
  functions: AppFunction[];
  users: IUserSession[];
  step: IStepSession;
}

export interface IStepSession extends IStepNavigation{
  language: IProgrammingLanguage;
  inGenOutputType: string;
  outValParamType: string;
}
export interface IUserSession extends IUserSessionNavigation, PublicUser{

}
