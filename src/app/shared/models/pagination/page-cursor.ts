import {BehaviorSubject, Observable} from "rxjs";
import {ApiHelperService, PageFunction} from "../../../core/services/http/api-helper.service";
import {GetParams} from "../http/get.params";
import {HateoasResponse} from "./hateoas-response";
import * as _ from "lodash";
import {HateoasPageResponse} from "./hateoas-page-response";



export class PageCursor<TResult, TFilter> {
  results: TResult[];
  hasNext: boolean;
  hasPrevious: boolean;

  public resultsSubject$ = new BehaviorSubject<TResult[]>([]);
  private pageSubjectFunction: PageFunction<TResult, TFilter>;
  private filter: GetParams<TResult, TFilter>;

  constructor(pageSubjectFunction: PageFunction<TResult, TFilter>, filter: GetParams<TResult, TFilter>) {
    this.pageSubjectFunction = pageSubjectFunction;
    this.filter = filter;
  }
  clone(filter:  TFilter): PageCursor<TResult, TFilter>{
    const newFilter = {...this.filter, filterObj: filter};
    return new PageCursor(this.pageSubjectFunction, newFilter);
  }

  updateFilter(filter:  GetParams<TResult, TFilter>){
    this.filter = {...this.filter, filterObj: filter.filterObj, descOrderColumns: filter.descOrderColumns, ascOrderColumns: filter.ascOrderColumns};
  }

  private _availableSizes = [10, 20, 50]

  get availableSizes(): number[] {
    return this._availableSizes.slice()
  }

  set availableSizes(sizes: number[]) {
    this._availableSizes = _.uniq(sizes);
  }

  private _totalValues: number;

  get totalValues(): number {
    return this._totalValues;
  }

  private _totalPages: number;

  get totalPages(): number {
    return this._totalPages;
  }

  get pageSize(): number {
    return this.filter.size;
  }

  set pageSize(size: number) {
    if (size !== this.filter.size) {
      this.filter.size = size;
      this.sendRequest();
    }
  }

  setPageSizeAndPage(pageSize: number, page: number) {
    if (page > this._totalPages || page < 1) return;
    const pageChanged = this.filter.page !== page;
    const sizeChanged = pageSize !== this.filter.size;
    if (pageChanged || sizeChanged){
      this.filter.page = page;
      this.filter.size = pageSize;
      this.sendRequest();
    }
  }


  next(): number {
    if (this.hasNext) {
      this.filter.page++;
      this.sendRequest();
    }
    return this.filter.page;
  }

  previous(): number {
    if (this.hasPrevious) {
      this.filter.page--;
      this.sendRequest();
    }
    return this.filter.page;
  }

  current(): number {
    this.sendRequest();
    return this.filter.page;
  }

  toPage(page: number) {
    if (page > this._totalPages || page < 1 || this.filter.page == page) return;
    this.filter.page = page
    this.sendRequest();
  }

  private sendRequest() {
    this.pageSubjectFunction(this.filter)
      .subscribe((page) => {
        const subResults = page.result.map(subRes => subRes.result);
        this.hasNext = !!page.nextLink();
        this.hasPrevious = !!page.previousLink();
        this._totalValues = page.total;
        this.setTotalPagesFromTotalValuesCount(page.total);
        this.resultsSubject$.next(subResults)
      });
  }

  private setTotalPagesFromTotalValuesCount(total: number) {
    this._totalPages = Math.ceil(total / this.filter.size);
  }


}
