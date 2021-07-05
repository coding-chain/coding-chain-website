import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITeamNavigation, ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import Swal from "sweetalert2";
import {SwalUtils} from '../../../shared/utils/swal.utils';

@Component({
  selector: 'app-profile-teams',
  templateUrl: './profile-teams.component.html',
  styles: []
})
export class ProfileTeamsComponent implements OnInit {

  @Input() team: ITeamNavigation;
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
