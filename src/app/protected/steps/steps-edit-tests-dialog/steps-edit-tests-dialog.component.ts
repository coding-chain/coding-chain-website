import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import * as _ from 'lodash';
import {toMatrix} from '../../../shared/utils/array.utils';

@Component({
  selector: 'app-steps-edit-tests-dialog',
  templateUrl: './steps-edit-tests-dialog.component.html',
  styles: []
})
export class StepsEditTestsDialogComponent implements OnInit {
  formArray: FormArray;
  private _tests: ITestNavigation[];

  get testsMatrix(): ITestNavigation[][]{
    return toMatrix(this._tests, 3);
  }

  constructor(public dialogRef: MatDialogRef<StepsEditTestsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) tests: ITestNavigation[],
              private readonly _fb: FormBuilder) {
    this._tests = _.cloneDeep(tests);
  }

  ngOnInit(): void {
  }

  onSaveClicked(): void {
    this.dialogRef.close(this._tests);
  }
}
