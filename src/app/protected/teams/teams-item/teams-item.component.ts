import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {ConnectedUser} from '../../../shared/models/users/connected-user';

@Component({
  selector: 'app-teams-item',
  templateUrl: './teams-item.component.html',
  styles: []
})
export class TeamsItemComponent implements OnInit {

  @Input() team: ITeamWithMembersResume;
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
