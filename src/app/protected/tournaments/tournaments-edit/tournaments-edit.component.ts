import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import * as _ from 'lodash';
import {cloneStepResume, IStepResume} from '../../../shared/models/steps/responses';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tournaments-edit',
  templateUrl: './tournaments-edit.component.html',
  styles: []
})
export class TournamentsEditComponent implements OnInit, OnDestroy {

  tournament$ = new Subject<ITournamentEdition>();
  languages$: Observable<IProgrammingLanguageNavigation[]>;
  steps: IStepResume[];
  private _routeSub: Subscription;
  private tournamentSub: Subscription;
  private tournament: ITournamentEdition;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tournamentService: TournamentService,
    private readonly _languageService: LanguageService) {
  }

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe(params => {
      this.setTournament(params.id);
      this.languages$ = this._languageService.getAll();
    });
  }

  ngOnDestroy(): void {
    this._routeSub.unsubscribe();
    this.tournamentSub.unsubscribe();
  }

  onTournamentSave(editedTournament: ITournamentEdition): void {
    this._tournamentService.updateFullTournament(this.tournament, this.steps, editedTournament).subscribe(res => {
      this.setTournament(this.tournament.id);
      Swal.fire(SwalUtils.successOptions('Tournois sauvegardé'));
    });
  }

  onExistingStepAdded(step: ITournamentEditionStep): void {
    this.steps.push(cloneStepResume(step));
  }

  onTournamentDelete(): void {
    this._tournamentService.deleteOne(this.tournament.id).subscribe(res => {
      Swal.fire(SwalUtils.successOptions('Tournoi supprimé')).then(closed =>
        this._router.navigate(['/tournaments'])
      );
    });
  }

  private setTournament(id: string): void {
    this.tournamentSub?.unsubscribe();
    this.tournamentSub = this._tournamentService.getTournamentEdition(id).subscribe(tournament => {
      this.tournament$.next(_.cloneDeep(tournament));
      this.tournament = tournament;
      this.steps = tournament.steps.map(s => cloneStepResume(s));
    });
  }
}
