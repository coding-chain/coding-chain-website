import {ITeamNavigation} from './responses';
import {IParticipationNavigation} from '../participations/responses';
import {IStepNavigation} from '../steps/responses';

export interface ITeamParticipation {
  team: ITeamNavigation;
  step: IStepNavigation;
  participation: IParticipationNavigation;
}
