import {CSharpFunction} from './csharp-function';
import {AppFunction} from './app-function';

export class FunctionFactory{
  public static new(props: Partial<AppFunction>): AppFunction {
    switch (props.language) {
      case 'CSharp':
        return new CSharpFunction(props);
    }
  }
}
