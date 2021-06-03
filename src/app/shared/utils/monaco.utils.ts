import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';
import {AppLanguage} from '../models/programming-languages/responses';
import {Theme} from '../../core/services/states/theme.service';

export type MonacoTheme = 'vs' | 'vs-dark';

export interface IMonacoThemeMapping {
  appTheme: Theme;
  monacoTheme: MonacoTheme;
}

export interface IMonacoLanguageMapping {
  appLanguage: AppLanguage;
  monacoLanguage: MonacoLanguage;
}

export type MonacoLanguage = 'csharp';

const themeMapping: IMonacoThemeMapping[] = [
  {appTheme: 'dark', monacoTheme: 'vs-dark'},
  {appTheme: 'light', monacoTheme: 'vs'}
];
const languageMapping: IMonacoLanguageMapping[] = [
  {appLanguage: 'CSharp', monacoLanguage: 'csharp'}
];


export function getDefaultMonacoEditorConfig(language: AppLanguage, theme: Theme): MonacoEditorConstructionOptions {
  const matchTheme = themeMapping.find(t => t.appTheme === theme)?.monacoTheme ?? 'vs';
  const matchLanguage = languageMapping.find(t => t.appLanguage === language)?.monacoLanguage ?? 'csharp';
  return {
    theme: matchTheme,
    language: matchLanguage,
    wrappingIndent: 'indent',
    automaticLayout: true
  };
}
