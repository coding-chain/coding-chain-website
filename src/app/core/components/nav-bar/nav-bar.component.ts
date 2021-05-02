import {Component, OnInit} from '@angular/core';
import {UserStateService} from '../../services/user-state.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ConnectedUserResponse} from '../../../shared/models/users/responses';
import {ConnectedUser} from '../../../shared/models/users/connected-user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: []
})
export class NavBarComponent implements OnInit {
  user$: BehaviorSubject<ConnectedUser>;

  constructor(private userStateService: UserStateService) {
    this.user$ = userStateService.userSubject$;
  }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.userStateService.updateUser(null);
  }
}
