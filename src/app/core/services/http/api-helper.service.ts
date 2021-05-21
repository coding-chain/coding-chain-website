import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {UrlUtils} from '../../../shared/utils/url.utils';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {environment} from '../../../../environments/environment';
import {GetParams} from '../../../shared/models/http/get.params';
import {HateoasPageResponse} from '../../../shared/models/pagination/hateoas-page-response';
import {forkJoin, Observable, of} from 'rxjs';
import * as _ from 'lodash';

export type HateoasPageResult<TResult> = HateoasPageResponse<TResult>;
export type PageFunction<TResult, TFilter> = (obj: GetParams<TResult, TFilter>) => Observable<HateoasPageResult<TResult>>;

export interface ResultMapping<TSource, TTarget> {
  source: TSource;
  target?: TTarget;
}

export interface HateoasResultMapping<TSource, TTarget> extends ResultMapping<HateoasResponse<TSource>, HateoasResponse<TTarget>> {
}

export interface ForkJoinRes<TId, TResult> {
  id: TId;
  res: TResult;
}

@Injectable({
  providedIn: 'root'
})
export abstract class ApiHelperService {

  protected abstract apiUrl = environment.apiUrl;

  constructor(protected readonly http: HttpClient) {
    this.getFiltered = this.getFiltered.bind(this);
  }


  public getFiltered<TResult, TTarget = TResult, TFilterTarget = TResult>(obj: GetParams<TTarget, TFilterTarget>)
    : Observable<HateoasPageResult<TResult>> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResult<TResult>>(url);
  }

  public getAllFiltered<TResult, TTarget = TResult, TFilterTarget = TResult>(obj: GetParams<TTarget, TFilterTarget>)
    : Observable<TResult[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResponse<TResult>>(url).pipe(map(res => res.result.map(subRes => subRes.result)));
  }

  public fetchAll<TResult, TTarget = TResult, TFilter = TResult>(obj: GetParams<TTarget, TFilter>): Observable<HateoasResponse<TResult>[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResponse<TResult>>(url).pipe(
      switchMap(page => {
        const observables: Observable<HateoasResponse<TResult>[]>[] = [];
        for (let i = page.currentPage + 1; i < page.pageCount; i++) {
          obj.page = i;
          const updatedUrl = UrlUtils.convertGetParamsToUrl(obj);
          observables.push(this.http.get<HateoasPageResponse<TResult>>(updatedUrl).pipe(
            map(p => p.result)
          ));
        }
        return forkJoin([of(page.result), ...observables]);
      }),
      map((res: [HateoasResponse<TResult>[]]) => {
        return _.flatMap(res);
      })
    );
  }

  public createAndLocate<TBody>(url: string, body: TBody): Observable<string> {
    return this.http.post(url, body, {observe: 'response'}).pipe(
      map(value => value.headers.get('location'))
    );
  }

  public createAndGet<TBody, TResult>(url: string, body: TBody): Observable<TResult> {
    return this.createAndLocate(url, body).pipe(
      switchMap(location => this.http.get<TResult>(location))
    );
  }

  public createAndGetIds<TBody>(url: string, body: TBody): Observable<any[]> {
    return this.createAndLocate(url, body).pipe(
      map(location => {
        const segments = UrlUtils.convertPathUrlToKeysValues(location);
        return segments.map(kV => kV.value);
      })
    );
  }


}
