import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit {

  @Input() tournament: ITournamentEdition;
  @Input() languages: IProgrammingLanguageNavigation[] = [];

  formGroup: FormGroup;
  isValid = new BehaviorSubject<boolean>(true);

  constructor(fb: FormBuilder) {
    this.formGroup = fb.group({});
    this.formGroup.valueChanges.subscribe(res => {
      this.isValid.next(this.formGroup.valid);
    });
  }

  private _descriptionCtrl: FormControl;

  set descriptionCtrl(ctrl: FormControl) {
    this._descriptionCtrl = ctrl;
    this.formGroup.setControl('description', this._descriptionCtrl);
  }

  private _nameCtrl: FormControl;

  set nameCtrl(ctrl: FormControl) {
    this._nameCtrl = ctrl;
    this.formGroup.setControl('name', this._nameCtrl);
  }

  ngOnInit(): void {
  }

  onStepsArrReady(stepsArray: FormArray) {
    this.formGroup.setControl('steps', stepsArray);
  }

  addStep() {
    this.tournament.steps.push({language: {}, order: this.tournament.steps.length + 1, tests: []} as ITournamentEditionStep);
    this.isValid.next(false);
  }
}
