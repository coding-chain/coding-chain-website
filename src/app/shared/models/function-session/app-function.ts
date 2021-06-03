import {AppLanguage} from '../programming-languages/responses';
import {FunctionPlaceholder, IFunctionSessionNavigation} from './responses';

export abstract class AppFunction implements IFunctionSessionNavigation {
    id: string;
    userId: string;
    code: string;
    order?: number;
    header?: string;
    language: AppLanguage;
    type: 'inGen' | 'outVal' | 'pipeline';


    protected constructor(props: Partial<AppFunction>) {
        this.id = props.id;
        this.userId = props.userId;
        this.code = props.code;
        this.order = props.order;
        this.type = props.type;
        this.language = props.language;
        if (props.header) {
            props.header = props.header.endsWith('\n') ? props.header : props.header + '\n';
        }
        this.header = props.header;
        if (!this.code) {
            this.code = this.initCode;
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

    get initCode(): string {
        switch (this.type) {
            case 'inGen':
                return this.inGenInitCode;
            case 'outVal':
                return this.outValInitCode;
            case 'pipeline':
                return this.pipelineInitCode;
        }
        return '';
    }

    get editorCode(): string {
        let code = !!this.header ? this.header + this.code : this.code;
        if (!this.code) {
            code += this.initCode;
        }
        return code;
    }

    public get codeWithoutHeader(): string {
        return this.code.replace(this.header, '');
    }

    protected abstract get outValInitCode(): string

    protected abstract get inGenInitCode(): string

    protected abstract get pipelineInitCode(): string


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
