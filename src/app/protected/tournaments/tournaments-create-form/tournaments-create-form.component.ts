import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ICreateTournamentCommand} from "../../../shared/models/tournaments/commands";
import {FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators} from "@angular/forms";

@Component({
  selector: 'app-tournaments-create-form',
  templateUrl: './tournaments-create-form.component.html',
  styles: []
})
export class TournamentsCreateFormComponent implements OnInit {

  @Output() creationSubmitted = new EventEmitter<ICreateTournamentCommand>();

  tournamentGrp: FormGroup;

  constructor(fb: FormBuilder) {
    this.tournamentGrp = fb.group({})
  }

  ngOnInit(): void {

  }

  reset(){
    this.tournamentGrp.reset();
  }

  createTournament() {
    this.creationSubmitted.emit(this.tournamentGrp.value)
  }

  set nameCtrl(nameCtrl$: FormControl) {
    this.tournamentGrp.setControl('name', nameCtrl$);
  }

  set descriptionCtrl(descriptionCtrl$: FormControl) {
    this.tournamentGrp.setControl('description', descriptionCtrl$);
  }
}
