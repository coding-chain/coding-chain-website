import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {ITournamentEdition} from '../../../shared/models/tournaments/tournament-edition';

@Component({
  selector: 'app-tournaments-edit',
  templateUrl: './tournaments-edit.component.html',
  styles: []
})
export class TournamentsEditComponent implements OnInit, OnDestroy {

  private _routeSub: Subscription;
  tournament$ = new Subject<ITournamentEdition>()
  private tournamentSub: Subscription;

  constructor(private readonly _route: ActivatedRoute, private readonly _tournamentService: TournamentService) {
  }

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe(params => {
      this.tournamentSub = this._tournamentService.getTournamentEdition(params.id).subscribe(tournament => {
        this.tournament$.next(tournament);
      })
    });
  }

  ngOnDestroy(): void {
    this._routeSub.unsubscribe();
    this.tournamentSub.unsubscribe();
  }
}
