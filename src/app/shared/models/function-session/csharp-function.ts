import {IFunctionSessionNavigation} from './responses';
import {AppFunction} from './app-function';
import * as _ from 'lodash';

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
            return this;
        }
        const fetchParametersResult = this.fetchParameters(signatureEndIdx);
        if (!fetchParametersResult) {
            return this;
        }
        this._name = this.getMethodName(fetchParametersResult.codeBeforeParam);
        const parseParamResult = this.parseParameter(fetchParametersResult.parameter);
        if (!parseParamResult) {
            return this;
        }
        const returnType = this.codeWithoutHeader.slice(
            this.codeWithoutHeader.indexOf('static') + 'static'.length,
            this.codeWithoutHeader.indexOf(this._name)).trim();
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
            if (this.codeWithoutHeader[i] === ')') {
                hasChanged = true;
                openBracketCnt--;
            } else if (this.codeWithoutHeader[i] === '(') {
                hasChanged = true;
                openBracketCnt++;
            } else {
                parameter += this.codeWithoutHeader[i];
            }
            if (openBracketCnt === 0 && hasChanged) {
                const reversed = _.reverse(parameter.split('')).join('');
                return {parameter: reversed, codeBeforeParam: this.codeWithoutHeader.slice(0, i)};
            }
        }
    }

    private parseParameter(parameter: string): { parameterType: string, parameterName: string } {
        const values = parameter.trim().split(' ');
        const parameterName = values.pop();
        const type = parameter.replace(parameterName, '');
        return {parameterType: type.trim(), parameterName: parameterName.trim()};
    }


    private getSignatureEndIdx(): number | undefined {
        const regex = new RegExp('{[\\s\\S]*}|=>');
        const match = regex.exec(this.codeWithoutHeader);
        return match?.index;
    }

    private getMethodName(code: string): string | undefined {
        return code.trim().split(' ').pop();
    }
}

