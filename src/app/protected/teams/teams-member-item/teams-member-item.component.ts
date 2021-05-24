import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMemberResume, ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {ConnectedUser} from '../../../shared/models/users/connected-user';

@Component({
  selector: 'app-teams-member-item',
  templateUrl: './teams-member-item.component.html',
  styles: [
  ]
})
export class TeamsMemberItemComponent implements OnInit {

  @Input() member: IMemberResume;
  @Input() canDelete = false;
  @Input() canElevate = false;

  @Output() elevateMember = new EventEmitter<IMemberResume>();
  @Output() deleteMember = new EventEmitter<IMemberResume>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.member);
  }

  elevate(): void {
    this.elevateMember.emit(this.member);
  }
  delete(): void{
    this.deleteMember.emit(this.member);
  }
}
