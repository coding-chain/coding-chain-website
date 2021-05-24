import {Component, OnInit} from '@angular/core';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {BehaviorSubject, forkJoin, Observable, Subject} from 'rxjs';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {switchMap, tap} from 'rxjs/operators';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {GetParams} from '../../../shared/models/http/get.params';
import {UserStateService} from '../../../core/services/user-state.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {Theme, ThemeService} from '../../../core/services/theme.service';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {TeamService} from '../../../core/services/http/team.service';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';


@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styles: []
})
export class TournamentsListComponent implements OnInit {
  tournamentCursor: PageCursor<ITournamentResume, ITournamentsFilter>;
  tournaments$ = new BehaviorSubject<ITournamentResume[]>([]);
  languages$: Observable<IProgrammingLanguageNavigation[]>;
  currentUser$ = new Subject<ConnectedUser>();
  theme$ = new BehaviorSubject<Theme>('light');

  constructor(private readonly _tournamentService: TournamentService,
              private readonly _languageService: LanguageService,
              private readonly _userStateService: UserStateService,
              private readonly _teamService: TeamService,
              private readonly _themeService: ThemeService) {
  }


  ngOnInit(): void {
    this.tournamentCursor = this._tournamentService.getTournamentResumeCursor();
    this.tournamentCursor.resultsSubject$.subscribe(tournaments => {
      this.tournaments$.next(tournaments);
    });
    this._themeService.themeSubject$.subscribe(theme => {
      this.theme$.next(theme);
    });
    this._themeService.publishTheme();
    this.tournamentCursor.current();
    this.languages$ = this._languageService.getAll().pipe(tap(res => console.log(res)));
    this.currentUser$ = this._userStateService.userSubject$;
    this._userStateService.loadUser();
  }

  searchTournaments($filter: GetParams<ITournamentResume, ITournamentsFilter>): void {
    this.tournamentCursor.updateFilter($filter);
    this.tournamentCursor.current();
  }

  onTournamentLeft(teams: ITeamNavigation[], tournament: ITournamentResume): void {
    forkJoin(teams.map(t => this._teamService.leaveTournament(t.id, tournament.id))).pipe(
      switchMap(res => this._userStateService.reloadUser$())
    ).subscribe(res => {
      this.tournamentCursor.current();
      Swal.fire(SwalUtils.successOptions(`Tournoi ${tournament.name} quitté pour les équipes suivantes ${teams.map(t => t.name).join(', ')}`));
    }, err => Swal.fire(SwalUtils.errorOptions(`Erreur lors de la désinscription du tournoi ${tournament.name}`)));
  }
}
