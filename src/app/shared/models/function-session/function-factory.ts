import {CSharpFunction} from './csharp-function';
import {AppFunction} from './app-function';
import {AppLanguage} from '../programming-languages/responses';
import {TypescriptFunction} from './typescript-function';

export class FunctionFactory{
  public static new(props: Partial<AppFunction>): AppFunction {
    switch (props.language) {
      case 'CSharp':
        return new CSharpFunction(props);
      case 'Typescript':
        return new TypescriptFunction(props);
    }
  }
}
