import {KeyValue} from "@angular/common";
import {IPaginationQuery} from "./i-pagination-query";

export interface GetParams<TResult, TFilterTarget = TResult> extends IPaginationQuery {
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
