import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import * as _ from 'lodash';
import {AuthenticationService} from '../http/authentication.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  userSubject$ = new BehaviorSubject<ConnectedUser>(null);

  constructor(private authService: AuthenticationService) {
  }

  private _user: ConnectedUser;

  get user(): ConnectedUser {
    return _.cloneDeep(this._user);
  }

  loadUser$(): Observable<ConnectedUser> {
    if (!this._user && this.authService.getRememberMe()) {
      return this.reloadUser$();
    }
    return of(this.user);
  }

  loadUser(): void {
    if (!this._user && this.authService.getRememberMe()) {
      this.reloadUser();
    }
    if (this._user) {
      this.userSubject$.next(this.user);
    }
  }

  reloadUser(): void {
    this.authService.getMe().subscribe(user => {
      this._user = new ConnectedUser(user);
      this.userSubject$.next(this.user);
    });
  }

  reloadUser$(): Observable<ConnectedUser> {
    return this.authService.getMe().pipe(map(user => {
      this._user = new ConnectedUser(user);
      this.userSubject$.next(this.user);
      return user;
    }));
  }


  updateUser(user: ConnectedUser): void {
    this._user = user;
    this.userSubject$.next(this.user);
  }
}
