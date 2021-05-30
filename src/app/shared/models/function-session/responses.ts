import {AppLanguage} from '../programming-languages/responses';
import * as _ from 'lodash';

export interface IFunctionSessionNavigation {
  id: string;
  userId: string;
  code: string;
  order?: number;
}

export type FunctionPlaceholder = '<inType>' | '<paramName>' | '<outType>' | '<code>' | '<functionName>';

export abstract class AppFunction implements IFunctionSessionNavigation {
  id: string;
  userId: string;
  code: string;
  order?: number;
  language: AppLanguage;
  type: 'inGen' | 'outVal' | 'pipeline';


  protected constructor(props: Partial<AppFunction>) {
    this.id = props.id;
    this.userId = props.userId;
    this.code = props.code;
    this.order = props.order;
    this.type = props.type;
    this.language = props.language;
    if (!this.code) {
      this.code = this.editorCode;
    }
  }

  protected _name?: string | null = null;
  public get name(): string | null {
    return this._name;
  }

  protected _parameterName?: string | null = null;
  public get parameterName(): string | null {
    return this._parameterName;
  }

  protected _inputType?: string | null = null;
  public get inputType(): string {
    return this._inputType;
  }

  protected _outputType?: string | null = null;
  public get outputType(): string {
    return this._outputType;
  }

  get editorCode(): string {
    if (!this.code) {
      switch (this.type) {
        case 'inGen':
          return this.inGenInitCode;
        case 'outVal':
          return this.outValInitCode;
        case 'pipeline':
          return this.pipelineInitCode;
      }
    }
    return this.code;
  }

  protected abstract get outValInitCode(): string

  protected abstract get inGenInitCode(): string

  protected abstract get pipelineInitCode(): string

  public static new(props: Partial<AppFunction>): AppFunction {
    switch (props.language) {
      case 'csharp':
        return new CSharpFunction(props);
    }
  }

  public isValid(): boolean {
    if (this.hasCodePlaceholder()) {
      return false;
    }
    if (this.type === 'inGen') {
      return this.inGenValid();
    }
    if (this.type === 'outVal') {
      return this.outValValid();
    }
    if (this.type === 'pipeline') {
      return this.pipelineValid();
    }
    return false;
  }

  abstract parse(): AppFunction;

  public reset(): void {
    this._parameterName = null;
    this._inputType = null;
    this._outputType = null;
    this._name = null;
  }

  public copy(other: AppFunction): AppFunction {
    this.id = other.id;
    this.code = other.code;
    this.order = other.order;
    this.type = other.type;
    this.language = other.language;
    return this.parse();
  }

  protected abstract inGenValid(): boolean;

  protected abstract outValValid(): boolean;

  protected abstract pipelineValid(): boolean;

  protected isFunctionPlaceholder(text: string): boolean {
    const placeholders: FunctionPlaceholder[] = ['<inType>', '<paramName>', '<outType>', '<code>', '<functionName>'];
    return placeholders.some(p => p === text);
  }

  protected hasCodePlaceholder(): boolean {
    return this.isFunctionPlaceholder(this.inputType)
      || this.isFunctionPlaceholder(this.outputType)
      || this.isFunctionPlaceholder(this.name)
      || this.isFunctionPlaceholder(this.parameterName);
  }
}

export class CSharpFunction extends AppFunction {
  constructor(props: Partial<IFunctionSessionNavigation>) {
    super(props);
  }

  protected get outValInitCode(): string {
    return `public static bool OutputValidator(<inType> <paramName>){
    <code>
}`;
  }

  protected get inGenInitCode(): string {
    return `public static <outType> InputGenerator(){
    <code>
}`;
  }

  protected get pipelineInitCode(): string {
    return `public static <outType> <functionName>(<inType> <paramName>){
    <code>
}`;
  }

  parse(): AppFunction {
    this.reset();
    const signatureEndIdx = this.getSignatureEndIdx();
    if (!signatureEndIdx) {
      return;
    }
    const fetchParametersResult = this.fetchParameters(signatureEndIdx);
    if (!fetchParametersResult) {
      return;
    }
    this._name = this.getMethodName(fetchParametersResult.codeBeforeParam);
    const parseParamResult = this.parseParameter(fetchParametersResult.parameter);
    if (!parseParamResult) {
      return;
    }
    const returnType = this.code.slice(this.code.indexOf('static') + 'static'.length, this.code.indexOf(this._name)).trim();
    this._inputType = parseParamResult.parameterType;
    this._outputType = returnType;
    this._parameterName = parseParamResult.parameterName;
    return this;
  }

  protected inGenValid(): boolean {
    return !this.parameterName && !this.inputType && !!this.outputType && !!this.name;
  }

  protected outValValid(): boolean {
    return !!this.parameterName && !!this.inputType && this.outputType === 'bool' && !!this.name;
  }

  protected pipelineValid(): boolean {
    return !!this.parameterName && !!this.inputType && !!this.outputType && !!this.name;
  }

  private fetchParameters(signatureEndIdx: number): { parameter: string, codeBeforeParam: string } | undefined {
    let openBracketCnt = 0;
    let hasChanged = false;
    let parameter = '';
    for (let i = signatureEndIdx - 1; i >= 0; i--) {
      if (this.code[i] === ')') {
        hasChanged = true;
        openBracketCnt--;
      } else if (this.code[i] === '(') {
        hasChanged = true;
        openBracketCnt++;
      } else {
        parameter += this.code[i];
      }
      if (openBracketCnt === 0 && hasChanged) {
        const reversed = _.reverse(parameter.split('')).join('');
        return {parameter: reversed, codeBeforeParam: this.code.slice(0, i)};
      }
    }
  }

  private parseParameter(parameter: string): { parameterType: string, parameterName: string } {
    const values = parameter.split(' ');
    const parameterName = values.pop();
    const type = parameter.replace(parameterName, '');
    return {parameterType: type.trim(), parameterName: parameterName.trim()};
  }


  private getSignatureEndIdx(): number | undefined {
    const regex = new RegExp('{[\\s\\S]*}|=>');
    const match = regex.exec(this.code);
    return match.index;
  }

  private getMethodName(code: string): string | undefined {
    return code.trim().split(' ').pop();
  }
}
