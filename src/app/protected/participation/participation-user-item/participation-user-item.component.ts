import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IUserSession} from '../../../shared/models/participations-session/participation-session';
import {ParticipationConnectedUser} from '../../../shared/models/users/connected-user';

@Component({
  selector: 'app-participation-user-item',
  templateUrl: './participation-user-item.component.html',
  styles: []
})
export class ParticipationUserItemComponent implements OnInit {

  @Input() currentUser: ParticipationConnectedUser;
  @Input() user: IUserSession;
  @Output() elevatedUser = new EventEmitter<IUserSession>();

  constructor() {
  }

  ngOnInit(): void {
  }

  elevate(): void {
    this.elevatedUser.emit(this.user);
  }
}
