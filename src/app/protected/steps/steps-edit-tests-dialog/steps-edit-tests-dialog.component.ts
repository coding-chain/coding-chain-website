import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import * as _ from 'lodash';
import {toMatrix} from '../../../shared/utils/array.utils';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {ITournamentStep} from '../../../shared/models/tournaments/commands';
import {ITestEdition} from '../../../shared/models/tests/test-edition';

@Component({
  selector: 'app-steps-edit-tests-dialog',
  templateUrl: './steps-edit-tests-dialog.component.html',
  styles: []
})
export class StepsEditTestsDialogComponent implements OnInit {
  testsArray: FormArray;
  constructor(public dialogRef: MatDialogRef<StepsEditTestsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) readonly  step: ITournamentEditionStep,
              private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.testsArray = this._fb.array([]);
  }
  onSaveClicked(): void {
    this.dialogRef.close(this.step);
  }

}
