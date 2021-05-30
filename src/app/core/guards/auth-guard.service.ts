import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/http/authentication.service';
import {UserStateService} from '../services/states/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, private readonly _userStateService: UserStateService, public router: Router) {
  }

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(obs => {
      this._userStateService.loadUser$().subscribe(user => {
        if (user) {
          return obs.next(true);
        }
        this.router.navigateByUrl('/login');
        return obs.next(false);
      });
    });
  }

}
