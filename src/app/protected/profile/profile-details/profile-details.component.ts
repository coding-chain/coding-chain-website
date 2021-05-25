import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/user-state.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styles: []
})
export class ProfileDetailsComponent implements OnInit {
  user$: Subject<ConnectedUser>;

  constructor(private userStateService: UserStateService) {
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;
    console.log( 'User' , this.user$);
  }

}
