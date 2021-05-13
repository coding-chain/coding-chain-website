import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {BehaviorSubject} from 'rxjs';
import {minDate, validateDateBetween} from '../../../shared/validators/date.validators';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit {

  @Input() set tournament(tournament: ITournamentEdition){
    this._tournament = tournament;
    this.startDateCtrl.setValue(tournament.startDate)
    this.endDateCtrl.setValue(tournament.endDate)
    this.isPublishedCtrl.setValue(tournament.isPublished);
    if(tournament.isPublished && tournament.endDate.getTime() > Date.now())
      this.isPublishedCtrl.disable();

  }
  @Input() languages: IProgrammingLanguageNavigation[] = [];

  _tournament: ITournamentEdition;
  formGroup: FormGroup;
  isValid = new BehaviorSubject<boolean>(true);
  startDateCtrl: FormControl;
  endDateCtrl: FormControl;
  isPublishedCtrl: FormControl;

  constructor(fb: FormBuilder) {
    this.startDateCtrl = fb.control(null, [minDate(new Date())]);
    this.endDateCtrl = fb.control(null);
    this.isPublishedCtrl = fb.control(null);
    this.startDateCtrl.valueChanges.pipe(
      map(textDate => {
        console.log(textDate);
        if (textDate) {
          return new Date(textDate);
        }
      })
    );
    this.formGroup = fb.group({
      startDate: this.startDateCtrl,
      endDate: this.endDateCtrl
    }, {validators: validateDateBetween(this.startDateCtrl, this.endDateCtrl)});
    this.formGroup.valueChanges.subscribe((res: ITournamentEdition) => {
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
