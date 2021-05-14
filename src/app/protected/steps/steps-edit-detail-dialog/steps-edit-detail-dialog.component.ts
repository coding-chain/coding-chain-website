import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {gtCtrlValidator, ltCtrlValidator} from '../../../shared/validators/number.validators';

@Component({
  selector: 'app-steps-edit-detail-dialog',
  templateUrl: './steps-edit-detail-dialog.component.html',
  styles: []
})
export class StepsEditDetailDialogComponent implements OnInit {

  maxDescriptionLength = 500;
  formGroup: FormGroup;
  step: ITournamentEditionStep;

  constructor(
    public dialogRef: MatDialogRef<StepsEditDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA)  step: ITournamentEditionStep,
    private readonly _fb: FormBuilder) {
    this.step = _.clone(step);
  }

  onSaveClicked(): void {
    this.step.description = this.formGroup.value.description;
    this.step.minFunctionsCount = this.formGroup.value.minFunctions;
    this.step.maxFunctionsCount = this.formGroup.value.maxFunctions;
    this.dialogRef.close(this.step);
  }

  ngOnInit(): void {
    this.formGroup = this._fb.group({});
    if(this.step.isPublished)
      this.formGroup.disable();
  }

}
