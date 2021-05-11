import { Component, OnInit } from '@angular/core';
import {TournamentService} from "../../../core/services/http/tournament.service";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-tournaments-list',
  templateUrl: './tournaments-list.component.html',
  styles: [
  ]
})
export class TournamentsListComponent implements OnInit {
  tournamentCursor: PageCursor<ITournamentNavigation, ITournamentNavigation>;
  private _tournaments: ITournamentNavigation[];
  tournaments$ = new BehaviorSubject<ITournamentNavigation[]>([])
  constructor(private readonly _tournamentService: TournamentService) {
    this.tournamentCursor = this._tournamentService.getCursor()
    this.tournamentCursor.resultsSubject$.subscribe(tournaments => {
      this.tournaments$.next(tournaments)
      this._tournaments = tournaments;
    });
    this.tournamentCursor.current();

  }

  ngOnInit(): void {
  }

}
