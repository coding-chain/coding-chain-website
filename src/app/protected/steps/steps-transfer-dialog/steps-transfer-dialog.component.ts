import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';

export interface IStepsTransferDialogData {
  currentSteps: IStepNavigation[],
  languages: IProgrammingLanguageNavigation[]
}

@Component({
  selector: 'app-steps-transfer-dialog',
  templateUrl: './steps-transfer-dialog.component.html',
  styles: []
})
export class StepsTransferDialogComponent implements OnInit {
  private selectedSteps: IStepNavigation[];


  constructor(
    public dialogRef: MatDialogRef<StepsTransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStepsTransferDialogData,
    private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  onAddClicked(): void {
    this.dialogRef.close(this.selectedSteps);
  }

  onSelectedStepsChanged(selectedSteps: IStepNavigation[]): void {
    this.selectedSteps = selectedSteps;
  }
}
