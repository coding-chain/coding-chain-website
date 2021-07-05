import {Component, Inject, OnInit} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CheckItem} from '../../../shared/models/forms';
import {ITeamNavigation} from '../../../shared/models/teams/responses';

export interface ITournamentsLeaveData {
  currentUser: ConnectedUser;
  tournament: ITournamentResume;
}

@Component({
  selector: 'app-tournaments-leave-dialog',
  templateUrl: './tournaments-leave-dialog.component.html',
  styles: []
})
export class TournamentsLeaveDialogComponent implements OnInit {

  teams: CheckItem<ITeamNavigation>[];

  constructor(public dialogRef: MatDialogRef<TournamentsLeaveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly _data: ITournamentsLeaveData) {
  }

  get indeterminate(): boolean {
    return !this.all && this.teams.some(t => t.check);
  }

  get all(): boolean {
    return this.teams.every(t => t.check);
  }

  set all(check: boolean) {
    this.teams.forEach(t => t.check = check);
  }

  ngOnInit(): void {
    this.teams = this._data.currentUser.getTeamsInParticipations(this._data.tournament.participations).map(t => ({check: false, item: t}));
  }

  close(): void {
    this.dialogRef.close(this.teams.filter(t => t.check).map(t => t.item));
  }
}
