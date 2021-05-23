import {BehaviorSubject} from 'rxjs';
import {PageFunction} from '../../../core/services/http/api-helper.service';
import {GetParams} from '../http/get.params';
import * as _ from 'lodash';


export class PageCursor<TResult, TFilter> {
  results: TResult[];
  hasNext: boolean;
  hasPrevious: boolean;

  public resultsSubject$ = new BehaviorSubject<TResult[]>([]);
  private pageSubjectFunction: PageFunction<TResult, TFilter>;
  private _filter: GetParams<TResult, TFilter>;

  constructor(pageSubjectFunction: PageFunction<TResult, TFilter>, filter: GetParams<TResult, TFilter>) {
    this.pageSubjectFunction = pageSubjectFunction;
    this._filter = filter;
  }

  get filter(): GetParams<TResult, TFilter> {
    return _.cloneDeep(this._filter);
  }

  private _availableSizes = [10, 20, 50];

  get availableSizes(): number[] {
    return this._availableSizes.slice();
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
    return this._filter.size;
  }

  set pageSize(size: number) {
    if (size !== this._filter.size) {
      this._filter.size = size;
      this.sendRequest();
    }
  }

  clone(filter: TFilter): PageCursor<TResult, TFilter> {
    const newFilter = {...this._filter, filterObj: filter};
    return new PageCursor(this.pageSubjectFunction, newFilter);
  }

  updateFilter(filter: GetParams<TResult, TFilter>): PageCursor<TResult, TFilter> {
    this._filter = {
      ...this._filter,
      filterObj: filter.filterObj,
      descOrderColumns: filter.descOrderColumns,
      ascOrderColumns: filter.ascOrderColumns
    };
    return this;
  }

  setPageSizeAndPage(pageSize: number, page: number): PageCursor<TResult, TFilter> {
    if (page > this._totalPages || page < 1) {
      return this;
    }
    const pageChanged = this._filter.page !== page;
    const sizeChanged = pageSize !== this._filter.size;
    if (pageChanged || sizeChanged) {
      this._filter.page = page;
      this._filter.size = pageSize;
      this.sendRequest();
    }
    return this;
  }


  next(): number {
    if (this.hasNext) {
      this._filter.page++;
      this.sendRequest();
    }
    return this._filter.page;
  }

  previous(): number {
    if (this.hasPrevious) {
      this._filter.page--;
      this.sendRequest();
    }
    return this._filter.page;
  }

  current(): number {
    this.sendRequest();
    return this._filter.page;
  }

  toPage(page: number): PageCursor<TResult, TFilter> {
    if (page > this._totalPages || page < 1 || this._filter.page === page) {
      return;
    }
    this._filter.page = page;
    this.sendRequest();
    return this;
  }

  private sendRequest(): void {
    this.pageSubjectFunction(this._filter)
      .subscribe((page) => {
        const subResults = page.result.map(subRes => subRes.result);
        this.hasNext = !!page.nextLink;
        this.hasPrevious = !!page.previousLink;
        this._totalValues = page.total;
        this._totalPages = page.pageCount;
        // this.setTotalPagesFromTotalValuesCount(page.total);
        this.resultsSubject$.next(subResults);
      });
  }

  private setTotalPagesFromTotalValuesCount(total: number): void {
    this._totalPages = Math.ceil(total / this._filter.size);
  }


}
