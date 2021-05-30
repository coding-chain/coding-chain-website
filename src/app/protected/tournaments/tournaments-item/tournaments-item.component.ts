import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {Theme} from '../../../core/services/states/theme.service';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {MatDialog} from '@angular/material/dialog';
import {ITournamentsLeaveData, TournamentsLeaveDialogComponent} from '../tournaments-leave-dialog/tournaments-leave-dialog.component';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {ITournamentsJoinData, TournamentsJoinDialogComponent} from '../tournaments-join-dialog/tournaments-join-dialog.component';
import {ITournamentStepNavigation} from '../../../shared/models/tournaments/responses';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tournaments-item',
  templateUrl: './tournaments-item.component.html',
  styles: []
})
export class TournamentsItemComponent implements OnInit {

  @Input() currentUser: ConnectedUser;
  @Input() tournament: ITournamentResume;
  @Input() theme: Theme;
  tournamentLanguages: IProgrammingLanguage[];
  @Output() tournamentLeave = new EventEmitter<ITeamNavigation[]>();


  constructor(private readonly _dialog: MatDialog, private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.tournamentLanguages = this.tournament.steps.map(s => s.language);
  }

  openJoinDialog(): void {
    this._dialog.open(TournamentsJoinDialogComponent, {
      width: dialogWidth('s'),
      height: dialogHeight('l'),
      data: {tournament: this.tournament, currentUser: this.currentUser} as ITournamentsJoinData
    });

  }

  canLeave(): boolean {
    return this.currentUser && this.tournament.isPublished && this.currentUser.canLeaveTournament(this.tournament.participations);
  }

  canJoin(): boolean {
    return this.currentUser && this.tournament.isPublished && this.tournament.startDate.getTime() <= Date.now();
  }

  openLeaveDialog(): void {
    const dialogRef = this._dialog.open(TournamentsLeaveDialogComponent, {
      width: dialogWidth('s'),
      height: dialogHeight('l'),
      data: {tournament: this.tournament, currentUser: this.currentUser} as ITournamentsLeaveData
    });
    dialogRef.afterClosed().subscribe((result: (ITeamNavigation[] | undefined)) => {
      if (!result) {
        return;
      }
      this.tournamentLeave.emit(result);
    });
  }

}
