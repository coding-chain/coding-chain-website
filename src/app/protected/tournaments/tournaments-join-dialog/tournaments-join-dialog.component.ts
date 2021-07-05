import {Component, Inject, OnInit} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ITeamParticipation} from '../../../shared/models/teams/team-participation';
import {Router} from '@angular/router';

export interface ITournamentsJoinData {
  currentUser: ConnectedUser;
  tournament: ITournamentResume;
}

@Component({
  selector: 'app-tournaments-join-dialog',
  templateUrl: './tournaments-join-dialog.component.html',
  styles: []
})
export class TournamentsJoinDialogComponent implements OnInit {

  teamsParticipation: ITeamParticipation[];
  tournament: ITournamentResume;

  constructor(public dialogRef: MatDialogRef<TournamentsJoinDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly _data: ITournamentsJoinData,
              private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.teamsParticipation = this._data.currentUser.getLastTeamsParticipations(this._data.tournament);
    this.tournament = this._data.tournament;
  }

  createAndJoin(): void {
    const orderedSteps = this.tournament.steps.sort((s1, s2) => s1.order - s2.order);
    this._router.navigate(['/teams', 'create'], {state: orderedSteps[0]});
  }

  join(teamParticipation: ITeamParticipation): void {
    this._router.navigate(['/participations', teamParticipation.participation.id]);
    this.dialogRef.close();
  }
}
