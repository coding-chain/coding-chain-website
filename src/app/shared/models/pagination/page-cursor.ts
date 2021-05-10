import {PaginationQuery} from "../http/pagination-query";
import {BehaviorSubject} from "rxjs";
import {ApiHelperService} from "../../../core/services/http/api-helper.service";
import {GetParams} from "../http/get.params";
import {HateoasResponse} from "./hateoas-response";

export class PageCursor<TResult, TFilter extends PaginationQuery> {
    results: TResult[];
    hasNext: boolean;
    hasPrevious: boolean;
    public resultsSubject = new BehaviorSubject<TResult[]>([]);
    private pageService: ApiHelperService;
    private filter: GetParams<TResult, TFilter>;

    constructor(pageService: ApiHelperService, filter: GetParams<TResult, TFilter>) {
        this.pageService = pageService;
        this.filter = filter;
    }

    private _totalPages: number;

    get totalPages(): number {
        return this._totalPages;
    }

    next(): number {
        if (this.hasNext) {
            this.filter.filterObj.page++;
            this.sendRequest();
        }
        return this.filter.filterObj.page;
    }

    previous(): number {
        if (this.hasPrevious) {
            this.filter.filterObj.page--;
            this.sendRequest();
        }
        return this.filter.filterObj.page;
    }

    current(): number {
        if (this.hasNext) {
            this.sendRequest();
        }
        return this.filter.filterObj.page;
    }

    private sendRequest() {
        this.pageService.getFiltered<HateoasResponse<TResult>[]>(this.filter as any)
            .subscribe((page) => {
                const subResults = page.result.map(subRes => subRes.result);
                this.hasNext = !!page.nextLink();
                this.hasPrevious = !!page.previousLink();
                this.setTotalPagesFromTotalValuesCount(page.total);
                this.resultsSubject.next(subResults)
            });
    }

    private setTotalPagesFromTotalValuesCount(total: number) {
        this._totalPages = Math.floor(total / this.filter.filterObj.size);
    }


}
