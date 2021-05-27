import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITeamResume} from '../../../shared/models/teams/responses';
import {ConnectedUser} from '../../../shared/models/users/connected-user';

@Component({
  selector: 'app-profile-teams',
  templateUrl: './profile-teams.component.html',
  styles: []
})
export class ProfileTeamsComponent implements OnInit {

  @Input() team: ITeamResume;
  @Input() connectedUser: ConnectedUser;

  @Output() leaveTeam = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  leave(): void {
    this.leaveTeam.emit();
  }
}
