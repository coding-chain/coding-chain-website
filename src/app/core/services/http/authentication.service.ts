import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {EMPTY, forkJoin, Observable, of} from 'rxjs';
import {ApiHelperService} from './api-helper.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {LoginUser} from '../../../shared/models/users/login-user';
import {PublicUser, Token} from '../../../shared/models/users/responses';
import {EditUserCommand, RegisterUserCommand} from '../../../shared/models/users/requests';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {RightService} from './right.service';
import {TeamService} from './team.service';
import {IRightNavigation} from '../../../shared/models/rights/responses';
import {IMemberNavigation, ITeamNavigation} from '../../../shared/models/teams/responses';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiHelperService {

  protected apiUrl = `${environment.apiUrl}/users`;
  private tokenKey = environment.webStorageTokenKey;
  private rememberMeKey = environment.rememberMeKey;

  constructor(http: HttpClient, private readonly _rightService: RightService, private readonly _teamService: TeamService) {
    super(http);
  }

  public clearLocalUserData(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  public getRememberMe(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<PublicUser>(`${this.apiUrl}/me`, {observe: 'response'})
      .pipe(
        map(res => res.ok),
        catchError(err => of(false))
      );
  }

  getMe(): Observable<ConnectedUser> {
    return this.http.get<PublicUser>(`${this.apiUrl}/me`).pipe(
      switchMap(user => {
        return forkJoin([of(user), ...user.rightIds.map(id => this._rightService.getById(id))]);
      }),
      switchMap(res => {
        const user = res[0] as PublicUser;
        return forkJoin([of(user), of(res.slice(1) as IRightNavigation[]), ...user.teamIds.map(id => this._teamService.getOneById(id))]);
      }),
      switchMap(res => {
        const user = res[0] as PublicUser;
        const members$ = user.teamIds.map(id => this._teamService.getMemberById(id, user.id));
        return forkJoin([
          of(user),
          of(res[1] as IRightNavigation[]),
          of(res.slice(2) as ITeamNavigation[]),
          ...members$]);
      }),
      map(res => {
        const user = res[0] as PublicUser;
        const teams = res[2] as ITeamNavigation[];
        const members = res.slice(3) as IMemberNavigation[];
        const connectedUser = new ConnectedUser(user);
        connectedUser.rights = res[1] as IRightNavigation[];
        connectedUser.teams = teams.map(t => {
          const member = members.find(m => m.teamId === t.id);
          return {...t, ...member};
        });
        return connectedUser;
      }),
      catchError(err => EMPTY));
  }

  register(user: RegisterUserCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, user);
  }

  login(user: LoginUser): Observable<ConnectedUser> {
    return this.http.post<Token>(`${this.apiUrl}/authentication`, user).pipe(
      switchMap(token => {
        this.setToken(token.token);
        this.setRememberMe(user.rememberMe);
        return this.getMe();
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setRememberMe(rememberMe: boolean): void {
    localStorage.setItem(this.rememberMeKey, String(rememberMe));
  }

  public updateMe(body: EditUserCommand): Observable<ConnectedUser> {
    return this.http.put(`${this.apiUrl}/me`, body).pipe(
      switchMap(_ => {
        return this.getMe();
      })
    );
  }


}

