import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {Theme} from '../../../core/services/states/theme.service';

export interface IPlagiarismCompareFunctionsDialogData {
  sourceFunction: AppFunction;
  otherFunction: AppFunction;
  theme: Theme;
}

@Component({
  selector: 'app-plagiarism-compare-functions-dialog',
  templateUrl: './plagiarism-compare-functions-dialog.component.html',
  styles: []
})
export class PlagiarismCompareFunctionsDialogComponent implements OnInit {

  sourceFunction: AppFunction;
  otherFunction: AppFunction;
  theme: Theme;

  constructor(public dialogRef: MatDialogRef<PlagiarismCompareFunctionsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IPlagiarismCompareFunctionsDialogData) {
  }

  ngOnInit(): void {
    this.otherFunction = this.data.sourceFunction;
    this.sourceFunction = this.data.sourceFunction;
    this.theme = this.data.theme;
  }

}
