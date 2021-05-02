import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {EMPTY, Observable, of} from 'rxjs';
import {ApiCommonService} from './api-common.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ConnectedUserResponse, UserToken} from '../../../shared/models/users/responses';
import {LoginUserQuery, RegisterUserCommand} from '../../../shared/models/users/requests';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ApiCommonService {

  constructor(http: HttpClient) {
    super(http);
  }

  private tokenKey = environment.webStorageTokenKey;

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


  isAuthenticated(): Observable<boolean> {
    return this.http.get<ConnectedUserResponse>(`${this.apiUrl}/me`, {observe: 'response'})
      .pipe(
        map(res => res.ok),
        catchError(err => of(false))
      );
  }

  getMe(): Observable<ConnectedUserResponse> {
    return this.http.get<ConnectedUserResponse>(`${this.apiUrl}/me`).pipe(
      catchError(err => EMPTY)
    );
  }

  register(user: RegisterUserCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration`, user);
  }

  login(user: LoginUserQuery): Observable<ConnectedUserResponse> {
    return this.http.post<UserToken>(`${this.apiUrl}/authentication`, user).pipe(
      switchMap(token => {
        this.setToken(token.token);
        return this.getMe();
      })
    );
  }


}

