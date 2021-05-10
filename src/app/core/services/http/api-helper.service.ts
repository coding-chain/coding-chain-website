import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UrlUtils} from '../../../shared/utils/url.utils';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {environment} from '../../../../environments/environment';
import {GetParams} from "../../../shared/models/http/get.params";
import {HateoasPageResponse} from "../../../shared/models/pagination/hateoas-page-response";

@Injectable({
  providedIn: 'root'
})
export abstract class ApiHelperService {

  protected abstract apiUrl = environment.apiUrl;

  constructor(protected readonly http: HttpClient) {
  }

  public getFiltered<TResult, TTarget = TResult, TFilterTarget = TResult>(obj: GetParams<TTarget, TFilterTarget>): Observable<HateoasPageResponse<TResult>> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResponse<TResult>>(url);
  }

  public getAllFiltered<TResult, TTarget = TResult, TFilterTarget = TResult>(obj: GetParams<TTarget, TFilterTarget>): Observable<TResult[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasPageResponse<HateoasResponse<TResult>[]>>(url).pipe(map(res => res.result.map(subRes => subRes.result)));
  }

  public fetchAll<TResult, P = TResult, F = TResult>(obj: GetParams<P, F>, acc: TResult[] = []): Observable<TResult[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return new Observable(subscriber => this.http.get<HateoasPageResponse<HateoasResponse<TResult>[]>>(url).subscribe(value => {
      const nextLink = value.links.find(l => l.rel === 'next');
      acc.push(...value.result.map(res => res.result));
      if (nextLink) {
        this.fetchAll({url: nextLink.href}, acc).subscribe(next => subscriber.next(acc));
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

  public createAndGetIds<TBody>(url: string, body: TBody): Observable<number[]> {
    return this.createAndLocate(url, body).pipe(
      map(location => {
        const segments = UrlUtils.convertPathUrlToKeysValues(location);
        return segments.map(kV => kV.value);
      })
    );
  }


}
