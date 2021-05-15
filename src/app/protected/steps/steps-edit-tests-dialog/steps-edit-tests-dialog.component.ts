import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder} from '@angular/forms';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {Theme} from '../../../core/services/theme.service';

export interface IStepsEditTestsDialogData {
  step: ITournamentEditionStep;
  theme: Theme;
}

@Component({
  selector: 'app-steps-edit-tests-dialog',
  templateUrl: './steps-edit-tests-dialog.component.html',
  styles: []
})
export class StepsEditTestsDialogComponent implements OnInit {
  testsArray: FormArray;
  step: ITournamentEditionStep;
  theme: Theme;
  constructor(public dialogRef: MatDialogRef<StepsEditTestsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: IStepsEditTestsDialogData,
              private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.step = this.data.step;
    this.theme = this.data.theme;
    this.testsArray = this._fb.array([]);
  }

  onSaveClicked(): void {
    this.dialogRef.close(this.step);
  }

}
