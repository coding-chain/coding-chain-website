import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as _ from 'lodash';
import {AuthenticationService} from './http/authentication.service';
import {ConnectedUser} from '../../shared/models/users/connected-user';

@Injectable()
export class UserStateService{

  user: ConnectedUser;
  userSubject$ = new BehaviorSubject<ConnectedUser>(null);

  constructor(private authService: AuthenticationService) {
  }

  loadUser(): void{
    if (!this.user && this.authService.getRememberMe()){
      this.authService.getMe().subscribe(user => {
        this.user = new ConnectedUser(user);
        this.userSubject$.next(_.clone(user));
      });
    }
    this.userSubject$.next(_.clone(this.user));
  }

  updateUser(user: ConnectedUser): void{
    this.user = user;
    this.userSubject$.next(_.clone(user));
  }
}
