import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {LanguageService} from '../../../core/services/http/language.service';
import {Subscription} from 'rxjs';
import {ITournamentDetail} from '../../../shared/models/tournaments/tournaments-detail';


@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styles: []
})
export class TournamentSummaryComponent implements OnInit {

  tournament: ITournamentDetail;
  private _routeSub: Subscription;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tournamentService: TournamentService,
    private readonly _languageService: LanguageService) {
  }

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe(params => {
      this.setTournament(params.id);
    });
  }

  private setTournament(id: string): void {
    this._tournamentService.getOneTournamentDetail(id).subscribe(tournament => {
      this.tournament = tournament;
    });
  }
}