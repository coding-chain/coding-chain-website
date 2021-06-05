import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {Theme} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-profile-tournament',
  templateUrl: './profile-tournament.component.html',
  styles: []
})
export class ProfileTournamentComponent implements OnInit {

  @Input() tournament: ITournamentResume;
  @Input() connectedUser: ConnectedUser;
  @Input() theme: Theme;
  tournamentLanguages: IProgrammingLanguage[];

  @Output() leaveTeam = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }
}
