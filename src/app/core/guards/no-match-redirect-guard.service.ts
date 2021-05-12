import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/http/authentication.service';

@Injectable({providedIn: 'root'})
export class NoMatchRedirectGuardService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) {
  }

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(obs => this.auth.isAuthenticated().subscribe((auth) => {
      if (auth) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/home');
      }
      return obs.next(false);
    }));
  }
}
