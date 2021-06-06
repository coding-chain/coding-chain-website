import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-profile-tournament',
  templateUrl: './profile-tournament.component.html',
  styles: []
})
export class ProfileTournamentComponent implements OnInit {

  @Input() tournament: ITournamentResume;
  @Input() connectedUser: ConnectedUser;
  theme: Theme;
  tournamentLanguages: IProgrammingLanguage[];

  constructor(private readonly _themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.tournamentLanguages = this.tournament.steps.map(s => s.language);

    this._themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
    });
    this._themeService.publishTheme();
  }
}
