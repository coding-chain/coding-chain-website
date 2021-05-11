import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {EMPTY, forkJoin, Observable, of} from 'rxjs';
import {ApiHelperService} from './api-helper.service';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {LoginUser} from '../../../shared/models/users/login-user';
import {PublicUser, UserToken} from "../../../shared/models/users/responses";
import {RegisterUserCommand} from "../../../shared/models/users/requests";
import {ConnectedUser} from "../../../shared/models/users/connected-user";
import {RightService} from "./right.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiHelperService {

  constructor(http: HttpClient, private rightService: RightService) {
    super(http);
  }

  private tokenKey = environment.webStorageTokenKey;
  private rememberMeKey = environment.rememberMeKey;

  protected apiUrl = `${environment.apiUrl}/users`;

  public clearLocalUserData(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setRememberMe(rememberMe: boolean): void {
    localStorage.setItem(this.rememberMeKey, String(rememberMe));
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
        const connectedUser = new ConnectedUser(user);
        return forkJoin([of(connectedUser), ...user.rightIds.map(id => this.rightService
          .getById(id)
          .pipe(
            tap(r => connectedUser.rights.push(r))
          ))]);
      } ),
      map((res: [ConnectedUser]) => res[0]),
      catchError(err => EMPTY)
    );
  }

  register(user: RegisterUserCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, user);
  }

  login(user: LoginUser): Observable<ConnectedUser> {
    return this.http.post<UserToken>(`${this.apiUrl}/authentication`, user).pipe(
      switchMap(token => {
        this.setToken(token.token);
        this.setRememberMe(user.rememberMe);
        return this.getMe();
      })
    );
  }


}

