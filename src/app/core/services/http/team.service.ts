import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {forkJoin, Observable, of} from 'rxjs';
import {
  IMemberNavigation,
  IMemberResume,
  ITeamNavigation,
  ITeamResume,
  memberNavToAddMemberCommand,
  teamNavToTeamCommand
} from '../../../shared/models/teams/responses';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map, switchMap} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {GetParams} from '../../../shared/models/http/get.params';
import {IAddMemberToTeamCommand, ICreateTeamCommand, IRenameTeamCommand} from '../../../shared/models/teams/commands';
import {ITeamFilter} from '../../../shared/models/teams/filters';
import {UserService} from './user.service';
import {PublicUser} from '../../../shared/models/users/responses';
import {ObjectUtils} from '../../../shared/utils/object.utils';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/teams`;

  constructor(http: HttpClient, private readonly _userService: UserService) {
    super(http);
    this.getTeamNavigationFiltered = this.getTeamNavigationFiltered.bind(this);
    this.getTeamResumeFiltered = this.getTeamResumeFiltered.bind(this);
  }

  public getTeamNavigationFiltered(obj: GetParams<ITeamNavigation, ITeamFilter>): Observable<HateoasPageResult<ITeamNavigation>> {
    return this.getFiltered(obj);
  }

  public getTeamResumeFiltered(obj: GetParams<ITeamResume, ITeamFilter>): Observable<HateoasPageResult<ITeamResume>> {
    return this.getFiltered<ITeamNavigation, ITeamResume, ITeamFilter>(obj).pipe(
      switchMap(page => forkJoin([of(page), ...page.result.map(t => this.getOneResumeById(t.result.id))])),
      map((res: [HateoasPageResult<ITeamNavigation> | ITeamResume]) => {
        const page = res[0] as HateoasPageResult<ITeamNavigation>;
        const teams = res.slice(1) as ITeamResume[];
        return page.clone(teams, (pageElement, subElement) => pageElement.result.id === subElement.id);
      })
    );
  }

  public getOneById(id: string): Observable<ITeamNavigation> {
    return this.http.get<HateoasResponse<ITeamNavigation>>(`${this.apiUrl}/${id}`).pipe(map(res => res.result));
  }

  public getAllMembers(teamId: string): Observable<IMemberNavigation[]> {
    return this.fetchAll<IMemberNavigation>({url: `${this.apiUrl}/${teamId}/members`}).pipe(
      map(res => res.map(m => m.result))
    );
  }

  public getOneResumeById(id: string): Observable<ITeamResume> {
    return this.getOneById(id).pipe(
      switchMap(team => forkJoin({team: of(team), members: this.getAllMembersResume(team.id)})),
      map(value => ({...value.team, members: value.members}))
    );
  }

  public getCursor(query?: GetParams<ITeamNavigation, ITeamFilter>): PageCursor<ITeamNavigation, ITeamFilter> {
    return new PageCursor<ITeamNavigation, ITeamFilter>(
      this.getTeamNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getResumeCursor(query?: GetParams<ITeamResume, ITeamFilter>): PageCursor<ITeamResume, ITeamFilter> {
    return new PageCursor<ITeamResume, ITeamFilter>(
      this.getTeamResumeFiltered, {url: this.apiUrl, ...query}
    );
  }

  public createOne(body: ICreateTeamCommand): Observable<ITeamNavigation> {
    return this.createAndGet<ICreateTeamCommand, HateoasResponse<ITeamNavigation>>(this.apiUrl, body).pipe(
      map(res => res.result)
    );
  }

  public addMember(teamId: string, body: IAddMemberToTeamCommand): Observable<IMemberNavigation> {
    return this.createAndGet<IAddMemberToTeamCommand, HateoasResponse<IMemberNavigation>>(`${this.apiUrl}/${teamId}/members`, body)
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

  public upsertFullTeam(originTeam: ITeamResume, editedTeam: ITeamResume): Observable<ITeamResume> {
    let upsert$ = of<ITeamResume>(editedTeam);
    const teamDifferences = ObjectUtils.getNotEqualsObjectWith(originTeam, editedTeam);
    if (!originTeam.id) {
      upsert$ = this.createAndGetTeamResume(editedTeam);
    } else if (teamDifferences.differentProperties.some(pName => pName === 'name')) {
      upsert$ = this.renameTeam(originTeam.id, teamNavToTeamCommand(editedTeam)).pipe(map(res => originTeam));
    }
    upsert$ = upsert$.pipe(
      switchMap(team => {
        editedTeam.members.forEach(m => m.teamId = team.id);
        return forkJoin([of(team), this.upsertMembers(originTeam.members, editedTeam.members)]);
      }),
      switchMap((res: [ITeamResume, any]) => this.getOneResumeById(res[0].id))
    );
    return upsert$;
  }

  public upsertMembers(originMembers: IMemberResume[], editedMembers: IMemberResume[]): Observable<any> {

    const newMembers = editedMembers.filter(eM => originMembers.every(oM => eM.userId !== oM.userId));
    const removedMembers = originMembers.filter(oM => editedMembers.every(eM => eM.userId !== oM.userId));
    const editedAdminMember = editedMembers.find(m => m.isAdmin === true);
    const originAdminMember = originMembers.find(m => m.isAdmin === true);
    let elevateMember$ = of(null);
    if (originAdminMember?.userId !== editedAdminMember?.userId) {
      elevateMember$ = this.elevateTeamMemberRight(editedAdminMember.teamId, editedAdminMember.userId);
    }
    const addMembers$ = newMembers.map(m => this.addMember(m.teamId, memberNavToAddMemberCommand(m)));
    const removeMembers$ = removedMembers.map(m => this.removeTeamMember(m.teamId, m.userId));
    return forkJoin([elevateMember$, ...addMembers$, ...removeMembers$]);
  }

  private createAndGetTeamResume(team: ITeamResume): Observable<ITeamResume> {
    return this.createAndGetIds<ICreateTeamCommand>(this.apiUrl, teamNavToTeamCommand(team)).pipe(
      switchMap(ids => this.getOneResumeById(ids[3]))
    );
  }

  private getAllMembersResume(teamId: string): Observable<IMemberResume[]> {
    return this.getAllMembers(teamId).pipe(
      switchMap(members => forkJoin([
        of(members),
        ...members.map(m => this._userService.getOneById(m.userId))]
      )),
      map((res: (IMemberNavigation[] | PublicUser)[]) => {
        const members = res[0] as IMemberNavigation[];
        const users = res.slice(1) as PublicUser[];
        return members.map(m => ({
          ...m, ...users.find(u => u.id === m.userId)
        }));
      })
    );
  }
}
