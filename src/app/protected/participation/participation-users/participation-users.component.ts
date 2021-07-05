import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUserSession} from '../../../shared/models/participations-session/participation-session';
import {ConnectedUser, ParticipationConnectedUser} from '../../../shared/models/users/connected-user';

@Component({
  selector: 'app-participation-users',
  templateUrl: './participation-users.component.html',
  styles: []
})
export class ParticipationUsersComponent implements OnInit {

  @Input() currentUser: ParticipationConnectedUser;
  @Input() users: IUserSession[];
  @Output() elevatedUser = new EventEmitter<IUserSession>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onElevatedUser($event: IUserSession): void {
    this.elevatedUser.emit($event);
  }
}
