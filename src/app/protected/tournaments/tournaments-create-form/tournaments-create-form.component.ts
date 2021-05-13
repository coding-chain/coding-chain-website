import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ICreateTournamentCommand} from '../../../shared/models/tournaments/commands';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tournaments-create-form',
  templateUrl: './tournaments-create-form.component.html',
  styles: []
})
export class TournamentsCreateFormComponent implements OnInit {

  @Output() creationSubmitted = new EventEmitter<ICreateTournamentCommand>();

  tournamentGrp: FormGroup;

  constructor(private readonly _fb: FormBuilder) {
  }

  set nameCtrl(nameCtrl$: FormControl) {
    this.tournamentGrp.setControl('name', nameCtrl$);
  }

  set descriptionCtrl(descriptionCtrl$: FormControl) {
    this.tournamentGrp.setControl('description', descriptionCtrl$);
  }

  ngOnInit(): void {
    this.tournamentGrp = this._fb.group({});
  }

  reset() {
    this.tournamentGrp.reset();
  }

  createTournament() {
    this.creationSubmitted.emit(this.tournamentGrp.value);
  }
}
