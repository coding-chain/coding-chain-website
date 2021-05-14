import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ICreateTournamentCommand} from '../../../shared/models/tournaments/commands';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-tournaments-create-form',
  templateUrl: './tournaments-create-form.component.html',
  styles: []
})
export class TournamentsCreateFormComponent implements OnInit {

  @Output() creationSubmitted = new EventEmitter<ICreateTournamentCommand>();

  tournamentGrp: FormGroup;
  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  invalid$ = new BehaviorSubject<boolean>(true)

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.nameCtrl = this._fb.control(null);
    this.descriptionCtrl = this._fb.control(null);
    this.tournamentGrp = this._fb.group({
      name: this.nameCtrl,
      description: this.descriptionCtrl
    });
    this.tournamentGrp.valueChanges.subscribe(res => this.invalid$.next(this.tournamentGrp.invalid || this.tournamentGrp.pristine))
  }

  reset() {
    this.tournamentGrp.reset();
  }

  createTournament() {
    this.creationSubmitted.emit(this.tournamentGrp.value);
  }
}
