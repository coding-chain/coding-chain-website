import {Component, Input, OnInit} from '@angular/core';
import {PublicUser} from '../../../shared/models/users/responses';

@Component({
  selector: 'app-team-teammate',
  templateUrl: './team-teammate.component.html',
})
export class TeamTeammateComponent implements OnInit {
  @Input() addOrDelete: (id) => void;
  @Input() manageStatus: (id) => void;
  @Input() teammates: PublicUser[];
  @Input() isDelete;
  icon;
  iconColor;

  displayedColumns: string[] = ['username', 'email', 'action'];

  constructor() {
  }

  ngOnInit(): void {
    this.icon = this.isDelete ? 'delete' : 'add';
    this.iconColor = this.isDelete ? 'warn' : 'primary';
    this.displayedColumns = this.manageStatus ? ['username', 'email', 'action', 'status'] : ['username', 'email', 'action'];
  }

}
