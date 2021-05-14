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
  descriptionCtrl: FormControl;

  maxDescriptionLength = 500;
  formGroup: FormGroup;
  step: ITournamentEditionStep;
  maxFunctionsCntCtrl: FormControl;
  minFunctionsCntCtrl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<StepsEditDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA)  step: ITournamentEditionStep,
    private readonly _fb: FormBuilder) {
    this.step = _.clone(step);
  }

  onSaveClicked(): void {
    this.step.description = this.descriptionCtrl.value;
    this.step.minFunctionsCount = this.minFunctionsCntCtrl.value;
    this.step.maxFunctionsCount = this.maxFunctionsCntCtrl.value;
    this.dialogRef.close(this.step);
  }

  ngOnInit(): void {
    this.maxFunctionsCntCtrl = this._fb.control(this.step.maxFunctionsCount);
    this.minFunctionsCntCtrl = this._fb.control(this.step.minFunctionsCount);
    this.minFunctionsCntCtrl.setValidators([gtCtrlValidator(this.maxFunctionsCntCtrl), Validators.min(0)]);
    this.maxFunctionsCntCtrl.setValidators([ltCtrlValidator(this.minFunctionsCntCtrl), Validators.min(0)]);
    this.descriptionCtrl = this._fb.control(this.step.description, [Validators.maxLength(this.maxDescriptionLength)])
    this.formGroup = this._fb.group({
      maxFunctions: this.maxFunctionsCntCtrl,
      minFunctions: this.minFunctionsCntCtrl,
      description: this.descriptionCtrl
    })
    if(this.step.isPublished)
      this.formGroup.disable();
  }

}
