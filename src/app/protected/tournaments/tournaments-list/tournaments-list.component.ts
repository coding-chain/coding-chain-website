import { Component, OnInit } from '@angular/core';
import {TournamentService} from "../../../core/services/http/tournament.service";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {BehaviorSubject, Observable} from "rxjs";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {LanguageService} from "../../../core/services/http/language.service";
import {tap} from "rxjs/operators";
import {ITournamentsFilter} from "../../../shared/models/tournaments/filters";

@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styles: [
  ]
})
export class TournamentsListComponent implements OnInit {
  tournamentCursor: PageCursor<ITournamentNavigation,  ITournamentsFilter>;
  private _tournaments: ITournamentNavigation[];
  tournaments$ = new BehaviorSubject<ITournamentNavigation[]>([])
  languages$: Observable<IProgrammingLanguageNavigation[]>;
  constructor(private readonly _tournamentService: TournamentService, private readonly _languageService: LanguageService) {
    this.tournamentCursor = this._tournamentService.getCursor()
    this.tournamentCursor.resultsSubject$.subscribe(tournaments => {
      this.tournaments$.next(tournaments)
      this._tournaments = tournaments;
    });
    this.tournamentCursor.current();
    this.languages$ = this._languageService.getAll().pipe(tap(res => console.log(res)));
  }

  ngOnInit(): void {
  }

  searchTournaments($filter: ITournamentsFilter) {
    this.tournamentCursor.update($filter)
    this.tournamentCursor.current();
  }
}
