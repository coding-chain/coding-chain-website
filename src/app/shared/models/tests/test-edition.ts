import {ITestNavigation} from './responses';
import {IProgrammingLanguageNavigation} from '../programming-languages/responses';

export interface ITestEdition extends ITestNavigation {
  language: IProgrammingLanguageNavigation;
  stepPublished: boolean;
}
