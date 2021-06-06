import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {PublicUser} from '../../../shared/models/users/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {EditUserCommand} from '../../../shared/models/users/requests';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/users`;

  constructor(http: HttpClient) {
    super(http);

    // this.getUserResumeFiltered = this.getUserResumeFiltered.bind(this);
    this.getUserFiltered = this.getUserFiltered.bind(this);
    this.getUserResumeCursor = this.getUserResumeCursor.bind(this);
  }

  public getOneById(id: string): Observable<PublicUser> {
    return this.http.get<HateoasResponse<PublicUser>>(`${this.apiUrl}/${id}`).pipe(map(res => res.result));
  }

  public getUserResumeCursor(query?: GetParams<PublicUser, IUsersFilter>): PageCursor<PublicUser, IUsersFilter> {
    return new PageCursor<PublicUser, IUsersFilter>(
      this.getUserFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getUserFiltered(obj: GetParams<PublicUser, IUsersFilter>): Observable<HateoasPageResult<PublicUser>> {
    return this.getFiltered<PublicUser, PublicUser, IUsersFilter>(obj).pipe(
      tap(res => console.log(res))
    );
  }

  /*public getUserResumeFiltered(obj: GetParams<PublicUser, IUsersFilter>): Observable<HateoasPageResult<PublicUser>> {
    console.log('getFiltered', this.getFiltered<PublicUser, PublicUser, IUsersFilter>(obj));
    return this.getFiltered<PublicUser, PublicUser, IUsersFilter>(obj);
  }*/

}
