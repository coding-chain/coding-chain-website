import {Injectable} from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ITeamNavigation} from "../../../shared/models/teams/responses";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {GetTeamsNavigationsPaginated} from "../../../shared/models/teams/queries";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/teams`;

  constructor(http: HttpClient) {
    super(http);
  }

  public getOneById(id: string): Observable<ITeamNavigation> {
    return this.http.get<HateoasResponse<ITeamNavigation>>(`${this.apiUrl}/${id}`).pipe(map(res => res.result));
  }

  public getCursor(query: GetTeamsNavigationsPaginated): PageCursor<ITeamNavigation, GetTeamsNavigationsPaginated> {
    return new PageCursor<ITeamNavigation, GetTeamsNavigationsPaginated>(this, {url: this.apiUrl, filterObj: query});
  }
}
