import {IPublicTestNavigation} from '../tests/responses';

export interface ITestSession extends IPublicTestNavigation{
  hasPassed?: boolean;
}
