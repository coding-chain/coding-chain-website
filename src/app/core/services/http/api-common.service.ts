import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {KeyValue} from '@angular/common';
import {map} from 'rxjs/operators';
import {UrlUtils} from '../../../shared/utils/url.utils';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {environment} from '../../../../environments/environment';

export interface GetParams<T, F = T> {
  url?: string;
  fieldCtr?: any;
  fields?: Array<keyof T>;
  ascOrderColumnsCtr?: any;
  ascOrderColumns?: Array<keyof T>;
  descOrderCtr?: any;
  descOrderColumns?: Array<keyof T>;
  filterObj?: F;
  filters?: KeyValue<string, any> [];
}

@Injectable({
  providedIn: 'root'
})
export abstract class ApiCommonService {

  protected abstract apiUrl = environment.apiUrl;

  constructor( protected readonly http: HttpClient) {
  }

  public getFiltered<T, P = T, F = T>(obj: GetParams<P, F>): Observable<T>{
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<T>(url);
  }

  public getAllFiltered<T, P = T, F = T>(obj: GetParams<P, F>): Observable<T[]>{
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return this.http.get<HateoasResponse<T[]>>(url).pipe( map(res => res.result));
  }

  public fetchAll<T, P = T, F = T>(obj: GetParams<P, F>, acc: T[] = []): Observable<T[]> {
    const url = UrlUtils.convertGetParamsToUrl(obj);
    return new Observable(subscriber => this.http.get<HateoasResponse<T[]>>(url).subscribe(value => {
      const nextLink = value.links.find(l => l.rel === 'next');
      acc.push(...value.result);
      if (nextLink) {
        this.fetchAll({url: nextLink.href}, acc).subscribe(next => subscriber.next(acc));
      } else {
        subscriber.next(acc);
      }
    }));
  }

  public createAndLocate<T>(url: string, body: T ): Observable<string> {
    return this.http.post(url, body, {observe: 'response'}).pipe(
      map(value => value.headers.get('location'))
    );
  }

  public createAndGetIds<T>(url: string, body: T ): Observable<number[]>{
    return this.createAndLocate(url, body).pipe(
      map(location => {
        const segments = UrlUtils.convertPathUrlToKeysValues(location);
        return segments.map(kV => kV.value);
      })
    );
  }


}
