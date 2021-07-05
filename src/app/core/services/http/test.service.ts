import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {GetParams} from '../../../shared/models/http/get.params';

@Injectable({
  providedIn: 'root'
})
export class TestService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/tests`;

  constructor(http: HttpClient) {
    super(http);
    this.getTestNavigationFiltered = this.getTestNavigationFiltered.bind(this);

  }

  public getTestNavigationFiltered(obj: GetParams<ITestNavigation>): Observable<HateoasPageResult<ITestNavigation>> {
    return this.getFiltered(obj);
  }

  public getById(id: string): Observable<ITestNavigation | undefined> {
    return this.http.get<HateoasResponse<ITestNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getCursor(query: GetParams<ITestNavigation>): PageCursor<ITestNavigation, ITestNavigation> {
    return new PageCursor<ITestNavigation, ITestNavigation>(
      this.getTestNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }
}
