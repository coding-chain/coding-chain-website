import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {BehaviorSubject, Subject} from 'rxjs';
import {minDate, validateDateBetween} from '../../../shared/validators/date.validators';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit {

  @Input() tournament: ITournamentEdition;


  @Input() languages: IProgrammingLanguageNavigation[] = [];

  formGroup: FormGroup;
  isInvalid$ = new BehaviorSubject(true);
  startDateCtrl: FormControl;
  endDateCtrl: FormControl;
  isPublishedCtrl: FormControl;

  constructor(private fb: FormBuilder) {

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
    if (this.tournament.isPublished && this.tournament.endDate.getTime() > Date.now()) {
      this.isPublishedCtrl.disable();
    }
    this.startDateCtrl = this.fb.control(this.tournament.startDate, [minDate(new Date())]);
    this.endDateCtrl = this.fb.control(this.tournament.endDate);
    this.isPublishedCtrl = this.fb.control(this.tournament.isPublished);
    this.startDateCtrl.valueChanges.pipe(
      map(textDate => {
        if (textDate) {
          return new Date(textDate);
        }
      })
    );
    this.formGroup = this.fb.group({
      startDate: this.startDateCtrl,
      endDate: this.endDateCtrl
    }, {validators: validateDateBetween(this.startDateCtrl, this.endDateCtrl)});
    this.formGroup.valueChanges.subscribe((res: ITournamentEdition) => {
      this.isInvalid$.next(this.formGroup.invalid);
    });
  }

  onStepsArrReady(stepsArray: FormArray) {
    this.formGroup.setControl('steps', stepsArray);
  }

  addStep() {
    this.tournament.steps.push({language: {}, order: this.tournament.steps.length + 1, tests: []} as ITournamentEditionStep);
    this.isInvalid$.next(false);
  }
}
