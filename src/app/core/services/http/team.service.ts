import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IMemberNavigation, ITeamNavigation} from '../../../shared/models/teams/responses';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {GetParams} from '../../../shared/models/http/get.params';
import {IAddMemberToTeamCommand, ICreateTeamCommand, IRenameTeamCommand} from '../../../shared/models/teams/commands';
import {ICreateTournamentCommand} from '../../../shared/models/tournaments/commands';
import {ITournamentNavigation} from '../../../shared/models/tournaments/responses';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/teams`;

  constructor(http: HttpClient) {
    super(http);
    this.getTeamNavigationFiltered = this.getTeamNavigationFiltered.bind(this);
  }

  public getTeamNavigationFiltered(obj: GetParams<ITeamNavigation>): Observable<HateoasPageResult<ITeamNavigation>> {
    return this.getFiltered(obj);
  }

  public getOneById(id: string): Observable<ITeamNavigation> {
    return this.http.get<HateoasResponse<ITeamNavigation>>(`${this.apiUrl}/${id}`).pipe(map(res => res.result));
  }

  public getCursor(query: GetParams<ITeamNavigation>): PageCursor<ITeamNavigation, ITeamNavigation> {
    return new PageCursor<ITeamNavigation, ITeamNavigation>(
      this.getTeamNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public createOne(body: ICreateTeamCommand): Observable<ITeamNavigation> {
    return this.createAndGet<ICreateTeamCommand, HateoasResponse<ITeamNavigation>>(this.apiUrl, body).pipe(
      map(res => res.result)
    );
  }

  public addMember(body: IAddMemberToTeamCommand): Observable<IMemberNavigation> {
    return this.createAndGet<IAddMemberToTeamCommand, HateoasResponse<IMemberNavigation>>(`${this.apiUrl}/members`, body)
      .pipe(
        map(res => res.result)
      );
  }

  public elevateTeamMemberRight(teamId: string, memberId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/members/${memberId}/elevation`, {});
  }

  public renameTeam(teamId: string, body: IRenameTeamCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${teamId}`, body);
  }

  public removeTeamMember(teamId: string, memberId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}/members/${memberId}`);
  }

  public deleteTeam(teamId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${teamId}`);
  }

  public getMemberById(teamId: string, memberId: string): Observable<IMemberNavigation> {
    return this.http.get<HateoasResponse<IMemberNavigation>>(`${this.apiUrl}/${teamId}/members/${memberId}`)
      .pipe(
        map(res => res.result)
      );
  }
}
