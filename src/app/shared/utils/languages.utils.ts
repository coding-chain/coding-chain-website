import {AppLanguage, IProgrammingLanguage, IProgrammingLanguageNavigation} from '../models/programming-languages/responses';
import {IAppColor} from './colors.utils';

export type LanguageLabel = 'c#' | 'ts';

export interface IThemeLanguageColorMapping {
  language: AppLanguage;
  color: IAppColor;
}

export interface ILanguageLabel {
  language: AppLanguage;
  label: LanguageLabel;
}


const colorsMapping: IThemeLanguageColorMapping[] = [
  {language: 'CSharp', color: {light: '#9a67ea', dark: '#320b86'}},
  {language: 'Typescript', color: {light: '#3178c6', dark: '#0159cc'}},
];
const labelsMapping: ILanguageLabel[] = [
  {language: 'CSharp', label: 'c#'},
  {language: 'Typescript', label: 'ts'}
];

export function getColorByLanguage(language: AppLanguage): IAppColor {
  return colorsMapping.find(m => m.language === language)?.color;
}

export function getLanguageLabelByLanguage(language: AppLanguage): LanguageLabel {
  return labelsMapping.find(m => m.language === language).label;
}


export function toProgrammingLanguage(src: IProgrammingLanguageNavigation): IProgrammingLanguage {
  return {color: getColorByLanguage(src.name), label: getLanguageLabelByLanguage(src.name), ...src};
}
