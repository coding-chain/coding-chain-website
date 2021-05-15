import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {Theme} from '../../../core/services/theme.service';
import {Subject} from 'rxjs';

export interface IStepsEditDetailDialogData {
  step: ITournamentEditionStep;
  theme: Theme;
}

@Component({
  selector: 'app-steps-edit-detail-dialog',
  templateUrl: './steps-edit-detail-dialog.component.html',
  styles: []
})
export class StepsEditDetailDialogComponent implements OnInit {

  maxDescriptionLength = 500;
  formGroup: FormGroup;
  step: ITournamentEditionStep;
  theme: Theme;

  constructor(
    public dialogRef: MatDialogRef<StepsEditDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly _data: IStepsEditDetailDialogData,
    private readonly _fb: FormBuilder) {
  }


  onSaveClicked(): void {
    this.step.description = this.formGroup.value.description;
    this.step.minFunctionsCount = this.formGroup.value.minFunctions;
    this.step.maxFunctionsCount = this.formGroup.value.maxFunctions;
    this.dialogRef.close(this.step);
  }

  ngOnInit(): void {
    this.step = _.clone(this._data.step);
    this.theme = this._data.theme;
    this.formGroup = this._fb.group({});
    if (this.step.isPublished) {
      this.formGroup.disable();
    }
  }

}
