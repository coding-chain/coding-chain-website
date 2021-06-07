import {LanguageLabel} from '../../utils/languages.utils';
import {IAppColor} from '../../utils/colors.utils';

export type AppLanguage = 'CSharp' | 'Typescript';

export interface IProgrammingLanguageNavigation {
  id: string;
  name: AppLanguage;
}

export interface IProgrammingLanguage extends IProgrammingLanguageNavigation {
  color: IAppColor;
  label: LanguageLabel;
}

export function cloneProgrammingLanguageNavigation(language: IProgrammingLanguageNavigation): IProgrammingLanguageNavigation {
  return {
    id: language.id,
    name: language.name
  };
}
