import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map} from 'rxjs/operators';
import {GetParams} from '../../../shared/models/http/get.params';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IRightNavigation} from '../../../shared/models/rights/responses';
import {IProgrammingLanguage, IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {toProgrammingLanguage} from '../../../shared/utils/languages.utils';
import {IChangeUserRightsCommand} from '../../../shared/models/rights/commands';


@Injectable({
  providedIn: 'root'
})
export class RightService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/rights`;

  constructor(http: HttpClient) {
    super(http);
    this.getRightNavigationFiltered = this.getRightNavigationFiltered.bind(this);

  }

  public getRightNavigationFiltered(obj: GetParams<IRightNavigation>): Observable<HateoasPageResult<IRightNavigation>> {
    return this.getFiltered(obj);
  }


  public getById(id: string): Observable<IRightNavigation | undefined> {
    return this.http.get<HateoasResponse<IRightNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getCursor(query: GetParams<IRightNavigation>): PageCursor<IRightNavigation, IRightNavigation> {
    return new PageCursor<IRightNavigation, IRightNavigation>(
      this.getRightNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getAll(): Observable<IRightNavigation[]> {
    return this.fetchAll<IRightNavigation>({url: this.apiUrl})
      .pipe(
        map(rights => rights.map(r => r.result))
      );
  }
}
