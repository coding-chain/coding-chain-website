import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {EMPTY, Observable, of} from 'rxjs';
import {ApiHelperService} from './api-helper.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {LoginUser} from '../../../shared/models/users/login-user';
import {PublicUser, UserToken} from "../../../shared/models/users/responses";
import {RegisterUserCommand} from "../../../shared/models/users/requests";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiHelperService {

  constructor(http: HttpClient) {
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

  getMe(): Observable<PublicUser> {
    return this.http.get<PublicUser>(`${this.apiUrl}/me`).pipe(
      catchError(err => EMPTY)
    );
  }

  register(user: RegisterUserCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, user);
  }

  login(user: LoginUser): Observable<PublicUser> {
    return this.http.post<UserToken>(`${this.apiUrl}/authentication`, user).pipe(
      switchMap(token => {
        this.setToken(token.token);
        this.setRememberMe(user.rememberMe);
        return this.getMe();
      })
    );
  }


}

