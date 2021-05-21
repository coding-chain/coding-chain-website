import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {UserStateService} from '../services/user-state.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Right} from '../../shared/models/rights/responses';

export interface IRightData {
  rights: Right[];
}

@Injectable({providedIn: 'root'})
export class RoleGuard implements CanActivate {

  constructor(public userService: UserStateService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userService.userSubject$.pipe(map(connectedUser => {
      const rights = (route.data as IRightData).rights;
      return rights?.length && connectedUser.hasSomeRights(rights);
    }));
  }
}
