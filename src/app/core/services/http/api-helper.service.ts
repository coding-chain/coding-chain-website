import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {UrlUtils} from '../../../shared/utils/url.utils';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {environment} from '../../../../environments/environment';
import {GetParams} from "../../../shared/models/http/get.params";
import {HateoasPageResponse} from "../../../shared/models/pagination/hateoas-page-response";
import {Observable} from "rxjs";

export type HateoasPageResult<TResult> = HateoasPageResponse<HateoasResponse<TResult>[]>;
export type PageFunction<TResult, TFilter> = (obj: GetParams<TResult, TFilter>) =>  Observable<HateoasPageResult<TResult>>

@Injectable({
  providedIn: 'root'
})
export abstract class ApiHelperService {

  protected abstract apiUrl = environment.apiUrl;

  constructor(protected readonly http: HttpClient) {
    this.getFiltered = this.getFiltered.bind(this);
  }


  public getFiltered<TResult, TTarget = TResult, TFilterTarget = TResult>(obj: GetParams<TTarget, TFilterTarget>): Observable<HateoasPageResult<TResult>> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResult<TResult>>(url);
  }

  public getAllFiltered<TResult, TTarget = TResult, TFilterTarget = TResult>(obj: GetParams<TTarget, TFilterTarget>): Observable<TResult[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResponse<HateoasResponse<TResult>[]>>(url).pipe(map(res => res.result.map(subRes => subRes.result)));
  }

  public fetchAll<TResult, P = TResult, F = TResult>(obj: GetParams<P, F>, acc: HateoasResponse<TResult>[] = []): Observable<HateoasResponse<TResult>[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return new Observable(subscriber => this.http.get<HateoasPageResponse<HateoasResponse<TResult>[]>>(url).subscribe(value => {
      const nextLink = value.links.find(l => l.rel === 'next');
      acc.push(...value.result);
      if (nextLink) {
        this.fetchAll({url: nextLink.href}, acc).subscribe(() => subscriber.next(acc));
      } else {
        subscriber.next(acc);
      }
    }));
  }

  public createAndLocate<TBody>(url: string, body: TBody): Observable<string> {
    return this.http.post(url, body, {observe: 'response'}).pipe(
      map(value => value.headers.get('location'))
    );
  }

  public createAndGet<TBody, TResult>(url: string, body: TBody): Observable<TResult> {
    return this.createAndLocate(url, body).pipe(
      switchMap(location =>  this.http.get<TResult>(location) )
    )
  }

  public createAndGetIds<TBody>(url: string, body: TBody): Observable<number[]> {
    return this.createAndLocate(url, body).pipe(
      map(location => {
        const segments = UrlUtils.convertPathUrlToKeysValues(location);
        return segments.map(kV => kV.value);
      })
    );
  }


}
