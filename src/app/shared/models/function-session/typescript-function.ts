import {AppFunction} from './app-function';
import {IFunctionSessionNavigation} from './responses';
import {CodeUtils} from '../../utils/code.utils';

export class TypescriptFunction extends AppFunction {
  constructor(props: Partial<IFunctionSessionNavigation>) {
    super(props);
  }

  protected get outValInitCode(): string {
    return `export function outputValidator(<paramName>: <inType> ): boolean {
    <code>
}`;
  }

  protected get inGenInitCode(): string {
    return `export function  inputGenerator(): <outType> {
    <code>
}`;
  }

  protected get pipelineInitCode(): string {
    return `export function <functionName>(<paramName>: <inType>): <outType>{
    <code>
}`;
  }

  parse(): AppFunction {
    this.reset();
    const signatureEndIdx = this.getSignatureEndIdx();
    const startParamsIdx = this.getStartParamsIdx();
    const endParamsIdx = this.getEndParamsIdx(startParamsIdx);
    const params = this.getParams(startParamsIdx + 1, endParamsIdx).trim();
    this.setOutputType(endParamsIdx, signatureEndIdx);
    this.setFunctionName();
    if (params) {
      this.setInputType(params);
      this.setInputParamName(params);
    }
    return this;
  }

  protected inGenValid(): boolean {
    return !this.parameterName && !this.inputType && !!this.outputType && !!this.name;
  }

  protected outValValid(): boolean {
    return !!this.parameterName && !!this.inputType && this.outputType === 'boolean' && !!this.name;
  }

  protected pipelineValid(): boolean {
    return !!this.parameterName && !!this.inputType && !!this.outputType && !!this.name;
  }


  private getSignatureEndIdx(): number | undefined {
    const regex = new RegExp('{[\\s\\S]*}');
    const match = regex.exec(this.codeWithoutHeader);
    const endIdx = match[0]?.length + match.index;
    return CodeUtils.getStartingScopeIdx(this.codeWithoutHeader, endIdx, '{', '}');
  }

  private getStartParamsIdx(): number {
    return this.codeWithoutHeader.indexOf('(');
  }

  private setFunctionName(): void {
    const funcEndIdx = this.codeWithoutHeader.indexOf('function') + 'function'.length;
    const signatureWithoutStart = this.codeWithoutHeader.slice(funcEndIdx);
    const startParamsIdx = signatureWithoutStart.indexOf('(');
    this._name = signatureWithoutStart.slice(0, startParamsIdx).trim();
  }

  private getEndParamsIdx(startParamsIdx: number): number {
    return CodeUtils.getEndingScopeIdx(this.codeWithoutHeader, startParamsIdx, '(', ')');
  }

  private setOutputType(endParamsIdx: number, endSignatureIdx: number): void {
    const afterParams = this.codeWithoutHeader.slice(endParamsIdx, endSignatureIdx);
    const outputsIdx = afterParams.indexOf(':') + 1;
    this._outputType = afterParams.slice(outputsIdx).trim();
  }

  private getParams(startParamsIdx: number, endParamsIdx: number): string {
    return this.codeWithoutHeader.slice(startParamsIdx, endParamsIdx);
  }

  private setInputParamName(params: string): void {
    this._parameterName = params.split(':').shift();
  }

  private setInputType(params: string): void {
    const startInputIdx = params.indexOf(':') + 1;
    this._inputType = params.slice(startInputIdx).trim();
  }
}

