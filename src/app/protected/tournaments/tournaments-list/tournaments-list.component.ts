import {Component, OnInit} from '@angular/core';
import {TournamentService} from "../../../core/services/http/tournament.service";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {BehaviorSubject, Observable} from "rxjs";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {LanguageService} from "../../../core/services/http/language.service";
import {tap} from "rxjs/operators";
import {ITournamentsFilter} from "../../../shared/models/tournaments/filters";
import {GetParams} from "../../../shared/models/http/get.params";
import {UserStateService} from "../../../core/services/user-state.service";
import {ConnectedUser} from "../../../shared/models/users/connected-user";
import {TournamentResume} from "../../../shared/models/tournaments/tournament-resume";

@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styles: []
})
export class TournamentsListComponent implements OnInit {
  tournamentCursor: PageCursor<TournamentResume, ITournamentsFilter>;
  tournaments$ = new BehaviorSubject<TournamentResume[]>([])
  languages$: Observable<IProgrammingLanguageNavigation[]>;
  currentUser$: Observable<ConnectedUser>;
  private _tournaments: TournamentResume[];

  constructor(private readonly _tournamentService: TournamentService, private readonly _languageService: LanguageService, private readonly _userStateService: UserStateService) {
    this.tournamentCursor = this._tournamentService.getTournamentResumeCursor()
    this.tournamentCursor.resultsSubject$.subscribe(tournaments => {
      this.tournaments$.next(tournaments)
      this._tournaments = tournaments;
    });
    this.tournamentCursor.current();
    this.languages$ = this._languageService.getAll().pipe(tap(res => console.log(res)));
    this.currentUser$ = this._userStateService.userSubject$;
  }

  ngOnInit(): void {
  }

  searchTournaments($filter: GetParams<TournamentResume, ITournamentsFilter>) {
    this.tournamentCursor.updateFilter($filter)
    this.tournamentCursor.current();
  }
}
