import {Injectable} from '@angular/core';
import {ApiHelperService} from './api-helper.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map} from 'rxjs/operators';
import {PublicUser} from '../../../shared/models/users/responses';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/users`;

  constructor(http: HttpClient) {
    super(http);
  }

  public getOneById(id: string): Observable<PublicUser> {
    return this.http.get<HateoasResponse<PublicUser>>(`${this.apiUrl}/${id}`).pipe(map(res => res.result));
  }

}
