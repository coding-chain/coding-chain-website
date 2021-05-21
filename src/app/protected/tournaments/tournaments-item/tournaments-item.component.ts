import {Component, Input, OnInit} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {Theme} from '../../../core/services/theme.service';

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


  constructor() {
  }

  ngOnInit(): void {
    this.tournamentLanguages = this.tournament.steps.map(s => s.language);
  }

  openJoinDialog(): void {

  }

  openLeaveDialog(): void {

  }
}
