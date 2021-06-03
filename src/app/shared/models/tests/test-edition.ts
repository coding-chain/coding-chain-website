import {ITestNavigation} from './responses';
import {IProgrammingLanguageNavigation} from '../programming-languages/responses';
import {AppFunction} from '../function-session/app-function';

export interface ITestEdition extends ITestNavigation {
  language: IProgrammingLanguageNavigation;
  stepPublished: boolean;
  inputFunc: AppFunction;
  outputFunc: AppFunction;
}
