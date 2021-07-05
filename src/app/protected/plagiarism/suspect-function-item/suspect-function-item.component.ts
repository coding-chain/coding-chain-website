import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlagiarizedFunction, ISuspectFunction} from '../../../shared/models/plagiarism/responses';
import {Theme} from '../../../core/services/states/theme.service';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {MatDialog} from '@angular/material/dialog';
import {
  IPlagiarismCompareFunctionsDialogData,
  PlagiarismCompareFunctionsDialogComponent
} from '../plagiarism-compare-functions-dialog/plagiarism-compare-functions-dialog.component';
import {CheckItem} from '../../../shared/models/forms';
import {IUpdateSuspectFunctionValidity} from '../../../shared/models/plagiarism/commands';

@Component({
  selector: 'app-suspect-function-item',
  templateUrl: './suspect-function-item.component.html',
  styles: []
})
export class SuspectFunctionItemComponent implements OnInit {
  @Input() theme: Theme;
  @Input() suspectFunction: ISuspectFunction;
  @Output() confirmAdvices = new EventEmitter<CheckItem<IPlagiarizedFunction>[]>();
  plagiarizedFunctions: CheckItem<IPlagiarizedFunction>[];
  suspectAppFunction: AppFunction;

  constructor(private readonly _dialog: MatDialog) {
  }

  get indeterminate(): boolean {
    return !this.all && this.plagiarizedFunctions.some(t => t.check);
  }

  get all(): boolean {
    return this.plagiarizedFunctions.every(t => t.check);
  }

  set all(check: boolean) {
    this.plagiarizedFunctions.forEach(t => t.check = check);
  }

  ngOnInit(): void {
    this.suspectAppFunction = FunctionFactory.new({
      code: this.suspectFunction.code,
      type: 'pipeline',
      language: this.suspectFunction.language.name
    }).parse();
    this.plagiarizedFunctions = this.suspectFunction.plagiarizedFunctions.map(f => ({item: f, check: false}));
  }

  onFunctionsCompare(func: AppFunction): void {
    const dialogRef = this._dialog.open(PlagiarismCompareFunctionsDialogComponent, {
      width: dialogWidth('xxl'),
      height: dialogHeight('xl'),
      data: {sourceFunction: this.suspectAppFunction, otherFunction: func, theme: this.theme} as IPlagiarismCompareFunctionsDialogData
    });
  }

  confirmAdvicesClicked(): void {
    this.confirmAdvices.emit(this.plagiarizedFunctions);
  }
}
