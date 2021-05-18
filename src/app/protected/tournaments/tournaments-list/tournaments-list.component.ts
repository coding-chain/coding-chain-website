import {Component, OnInit} from '@angular/core';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {BehaviorSubject, Observable} from 'rxjs';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {tap} from 'rxjs/operators';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {GetParams} from '../../../shared/models/http/get.params';
import {UserStateService} from '../../../core/services/user-state.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';


@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styles: []
})
export class TournamentsListComponent implements OnInit {
  tournamentCursor: PageCursor<ITournamentResume, ITournamentsFilter>;
  tournaments$ = new BehaviorSubject<ITournamentResume[]>([]);
  languages$: Observable<IProgrammingLanguageNavigation[]>;
  currentUser$: Observable<ConnectedUser>;

  constructor(private readonly _tournamentService: TournamentService, private readonly _languageService: LanguageService, private readonly _userStateService: UserStateService) {

  }


  ngOnInit(): void {
    this.tournamentCursor = this._tournamentService.getTournamentResumeCursor();
    this.tournamentCursor.resultsSubject$.subscribe(tournaments => {
      this.tournaments$.next(tournaments);
    });
    this.tournamentCursor.current();
    this.languages$ = this._languageService.getAll().pipe(tap(res => console.log(res)));
    this.currentUser$ = this._userStateService.userSubject$;
  }

  searchTournaments($filter: GetParams<ITournamentResume, ITournamentsFilter>): void {
    this.tournamentCursor.updateFilter($filter);
    this.tournamentCursor.current();
  }
}
