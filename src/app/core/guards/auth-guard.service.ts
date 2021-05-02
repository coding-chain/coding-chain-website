import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/http/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {
  }

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(obs => this.auth.isAuthenticated().subscribe((auth) => {
      if (auth) {
        return obs.next(true);
      }
      this.router.navigateByUrl('/login');
      return obs.next(false);
    }));
  }

}
