import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {IPublicUser} from '../../../shared/models/users/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {EditUserCommand} from '../../../shared/models/users/requests';
import {IChangeUserRightsCommand} from '../../../shared/models/rights/commands';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/users`;

  constructor(http: HttpClient) {
    super(http);
    this.getUserFiltered = this.getUserFiltered.bind(this);
    this.getPublicUsersCursor = this.getPublicUsersCursor.bind(this);
  }
  public updateRights(userId: string, cmd: IChangeUserRightsCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/rights`, cmd);
  }

  public deleteOneById(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }


  public getOneById(id: string): Observable<IPublicUser> {
    return this.http.get<HateoasResponse<IPublicUser>>(`${this.apiUrl}/${id}`).pipe(map(res => res.result));
  }

  public getPublicUsersCursor(query?: GetParams<IPublicUser, IUsersFilter>): PageCursor<IPublicUser, IUsersFilter> {
    return new PageCursor<IPublicUser, IUsersFilter>(
      this.getUserFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getUserFiltered(obj: GetParams<IPublicUser, IUsersFilter>): Observable<HateoasPageResult<IPublicUser>> {
    return this.getFiltered<IPublicUser, IPublicUser, IUsersFilter>(obj).pipe(
      tap(res => console.log(res))
    );
  }
}
