import {KeyValue} from "@angular/common";
import {IPaginationQuery} from "./i-pagination-query";

export interface GetParams<TResult, TFilterTarget = TResult> extends IPaginationQuery {
    url?: string;
    ascOrderColumns?: Array<keyof TResult | keyof TFilterTarget>;
    descOrderColumns?: Array<keyof TResult | keyof TFilterTarget>;
    filterObj?: TFilterTarget;
}
