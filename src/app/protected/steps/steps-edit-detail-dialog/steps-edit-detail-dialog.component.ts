import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';

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

  constructor(
    public dialogRef: MatDialogRef<StepsEditDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA)  step: ITournamentEditionStep,
    private readonly _fb: FormBuilder) {
    this.step = _.clone(step);
  }

  onSaveClicked(): void {
    this.dialogRef.close(this.step);
  }

  ngOnInit(): void {
    this.descriptionCtrl = this._fb.control(this.step.description, [Validators.maxLength(this.maxDescriptionLength)])
    this.formGroup = this._fb.group({
      description: this.descriptionCtrl
    })
  }

}
