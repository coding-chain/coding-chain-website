import {KeyValue} from "@angular/common";

export interface GetParams<TResult, TFilterTarget = TResult> {
    url?: string;
    fieldCtr?: any;
    fields?: Array<keyof TResult>;
    ascOrderColumnsCtr?: any;
    ascOrderColumns?: Array<keyof TResult>;
    descOrderCtr?: any;
    descOrderColumns?: Array<keyof TResult>;
    filterObj?: TFilterTarget;
    filters?: KeyValue<string, any> [];
}
