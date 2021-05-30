import {Component, Inject, OnInit} from '@angular/core';
import {Theme} from '../../../core/services/states/theme.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppFunction} from '../../../shared/models/function-session/responses';
import * as _ from 'lodash';
import {AppLanguage} from '../../../shared/models/programming-languages/responses';


export interface IParticipationEditFunctionData {
  function: AppFunction;
  theme: Theme;
}

@Component({
  selector: 'app-participation-edit-function-dialog',
  templateUrl: './participation-edit-function-dialog.component.html',
  styles: []
})
export class ParticipationEditFunctionDialogComponent implements OnInit {

  formGroup: FormGroup;
  function: AppFunction;
  theme: Theme;
  language: AppLanguage;

  constructor(
    public dialogRef: MatDialogRef<ParticipationEditFunctionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly _data: IParticipationEditFunctionData,
    private readonly _fb: FormBuilder) {
  }

  onSaveClicked(): void {
    this.function.code = this.formGroup.value.code;
    this.dialogRef.close(this.function);
  }

  ngOnInit(): void {
    this.theme = this._data.theme;
    this.function = AppFunction.new(_.cloneDeep(this._data.function)).parse();
    this.formGroup = this._fb.group({});
  }

}
