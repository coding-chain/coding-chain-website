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
  testsMatrix: ITestNavigation[][] = [];
  private _tests: ITestEdition[];
  constructor(public dialogRef: MatDialogRef<StepsEditTestsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly  _step: ITournamentEditionStep,
              private readonly _fb: FormBuilder) {
  }


  ngOnInit(): void {
    console.log(this._step);
    this._tests = this._step.tests.map(t => ({language: this._step.language.name, ..._.clone(t)}))
    this.testsMatrix = toMatrix(this._tests, 3);
    this.testsArray = this._fb.array([]);
  }

  onSaveClicked(): void {
    this.dialogRef.close(this._step);
  }


  getTestForm(i: number): FormGroup{
    const newTestGrp =  this._fb.group({});
    if(this._step.isPublished)
      newTestGrp.disable();
    this.testsArray.setControl(i, newTestGrp)
    return newTestGrp
  }


  addTest() {
    this._tests.unshift({language: this._step.language.name, stepId: this._step.id, score: 1} as ITestEdition)
    this.testsMatrix = toMatrix(this._tests, 3);
  }
}
