import {Component, OnInit, ViewChild} from '@angular/core';
import {ICreateTournamentCommand, ICreateTournamentWithImageCommand} from '../../../shared/models/tournaments/commands';
import {TournamentService} from '../../../core/services/http/tournament.service';
import Swal from 'sweetalert2';
import {TournamentsCreateFormComponent} from '../tournaments-create-form/tournaments-create-form.component';

@Component({
  selector: 'app-tournaments-create',
  templateUrl: './tournaments-create.component.html',
  styles: []
})
export class TournamentsCreateComponent implements OnInit {

  @ViewChild(TournamentsCreateFormComponent) form: TournamentsCreateFormComponent;

  constructor(private readonly tournamentService: TournamentService) {
  }

  ngOnInit(): void {
  }

  createTournament(tournamentCommand$: ICreateTournamentWithImageCommand): void {
    this.tournamentService.createOne(tournamentCommand$).subscribe(
      value => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Tournois créé'
        });
        this.form.reset();
      },
      err => Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Impossible de créer le tournois'
      }));
  }
}
