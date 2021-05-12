import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {ITournamentEdition} from '../../../shared/models/tournaments/tournament-edition';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';

@Component({
  selector: 'app-tournaments-edit',
  templateUrl: './tournaments-edit.component.html',
  styles: []
})
export class TournamentsEditComponent implements OnInit, OnDestroy {

  tournament$ = new Subject<ITournamentEdition>();
  languages$: Observable<IProgrammingLanguageNavigation[]>;
  private _routeSub: Subscription;
  private tournamentSub: Subscription;

  constructor(private readonly _route: ActivatedRoute, private readonly _tournamentService: TournamentService, private readonly _languageService: LanguageService) {
  }

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe(params => {
      this.tournamentSub = this._tournamentService.getTournamentEdition(params.id).subscribe(tournament => {
        this.tournament$.next(tournament);
      });
      this.languages$ = this._languageService.getAll();
    });
  }

  ngOnDestroy(): void {
    this._routeSub.unsubscribe();
    this.tournamentSub.unsubscribe();
  }
}
