import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPublicUser} from '../../../shared/models/users/responses';

@Component({
  selector: 'app-team-teammate',
  templateUrl: './team-teammate.component.html',
})
export class TeamTeammateComponent implements OnInit {
  @Input() teammates: IPublicUser[];
  // @Input() isDelete;
  // icon: string;
  // iconColor: string;
  // tooltips: string;
  //
  // @Output() actionClick = new EventEmitter<any>();
  // @Output() manageStatusClick = new EventEmitter<any>();
  //
  // displayedColumns: string[] = ['username', 'email', 'action'];

  constructor() {
  }

  ngOnInit(): void {
    // this.icon = this.isDelete ? 'delete' : 'add';
    // this.iconColor = this.isDelete ? 'warn' : 'primary';
    // this.tooltips = this.isDelete ? 'Retiré de l\'équipe' : 'Ajouter à l\'équipe';
    // this.displayedColumns = this.manageStatus ? ['username', 'email', 'action', 'status'] : ['username', 'email', 'action'];
  }

}
