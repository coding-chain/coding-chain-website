import {Component, OnInit} from '@angular/core';
import {UserStateService} from '../../services/user-state.service';
import {BehaviorSubject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {AuthenticationService} from '../../services/http/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: []
})
export class NavBarComponent implements OnInit {
  user$: BehaviorSubject<ConnectedUser>;

  constructor(private userStateService: UserStateService, private authService: AuthenticationService) {
    this.user$ = userStateService.userSubject$;
  }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.userStateService.updateUser(null);
    this.authService.clearLocalUserData();
  }
}
