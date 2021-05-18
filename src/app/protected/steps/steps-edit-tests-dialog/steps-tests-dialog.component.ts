import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder} from '@angular/forms';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {Theme} from '../../../core/services/theme.service';
import {BehaviorSubject} from 'rxjs';
import {delay} from 'rxjs/operators';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import * as _ from 'lodash';
import {IStepResume} from '../../../shared/models/steps/responses';

export interface IStepsTestsDialogData {
  step: ITournamentEditionStep;
  theme: Theme;
  readonly: boolean;
}

@Component({
  selector: 'app-steps-tests-dialog',
  templateUrl: './steps-tests-dialog.component.html',
  styles: []
})
export class StepsTestsDialogComponent implements OnInit {
  testsArray: FormArray;
  step: IStepResume;
  theme: Theme;
  readonly: boolean;
  invalid$ = new BehaviorSubject<boolean>(true);
  editedTests: ITestNavigation[] = [];

  constructor(public dialogRef: MatDialogRef<StepsTestsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: IStepsTestsDialogData,
              private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.step = this.data.step;
    this.step.tests = _.cloneDeep(this.step.tests);
    this.theme = this.data.theme;
    this.readonly = this.data.readonly;
    this.testsArray = this._fb.array([]);
    this.testsArray.valueChanges.pipe(delay(100)).subscribe(res => {
      return this.invalid$.next(this.testsArray.invalid);
    });
  }

  onSaveClicked(): void {
    this.dialogRef.close(this.editedTests);
  }

}
