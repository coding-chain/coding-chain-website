import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {UserStateService} from '../services/user-state.service';
import {Observable, of} from 'rxjs';
import {TeamService} from '../services/http/team.service';

@Injectable({providedIn: 'root'})
export class TeamAdminGuardService implements CanActivate {

  constructor(private readonly _userStateService: UserStateService, private readonly _teamService: TeamService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return new Observable<boolean>(obs => {
      this._userStateService.loadUser$().subscribe(user => {
        if (user.isTeamAdmin(route.params.id)) {
          return obs.next(true);
        }
        this.router.navigateByUrl('/teams');
        return obs.next(false);
      });
    });
  }

}
