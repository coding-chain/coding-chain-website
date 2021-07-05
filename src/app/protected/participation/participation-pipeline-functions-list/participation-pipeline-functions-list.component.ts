import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';
import {
  IParticipationEditFunctionData,
  ParticipationEditFunctionDialogComponent
} from '../participation-edit-function-dialog/participation-edit-function-dialog.component';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {MatDialog} from '@angular/material/dialog';
import {Theme} from '../../../core/services/states/theme.service';

export interface IPipelineErrors {
  noFunctionsError?: boolean;
  minFunctionsError?: boolean;
  maxFunctionsError?: boolean;
  pipelineTypeError?: boolean;
}

@Component({
  selector: 'app-participation-pipeline-functions-list',
  templateUrl: './participation-pipeline-functions-list.component.html',
  styles: []
})
export class ParticipationPipelineFunctionsListComponent implements OnInit {

  @Output() functionUpdate = new EventEmitter<AppFunction>();
  @Input() inGenFunctionType: string;
  @Input() outValFunctionType: string;
  @Input() canDragOrDrop = false;
  @Input() formGrp: FormGroup;
  @Input() maxFunctionsCnt?: number;
  @Input() minFunctionsCnt?: number;
  @Input() theme: Theme;

  constructor(private dialog: MatDialog) {
  }

  _functions: AppFunction[] = [];

  @Input() set functions(functions: AppFunction[]) {
    this._functions = functions.map(f => FunctionFactory.new(f).parse());
    const errors: IPipelineErrors = {};
    let hasError = this.checkTypesContinuity(errors);
    hasError ||= this.checkRequired(errors);
    hasError ||= this.checkMin(errors);
    hasError ||= this.checkMax(errors);
    if (hasError) {
      this.formGrp.setErrors(errors);
    } else {
      this.formGrp.setErrors(null);
    }
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<AppFunction[]>): void {
    const movedFunction = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    this._functions.forEach((f, i) => {
      if (movedFunction.id === f.id) {
        movedFunction.order = i + 1;
      }
    });
    this.functionUpdate.emit(movedFunction);
  }

  onDisplay($func: AppFunction): void {
    this.dialog.open(ParticipationEditFunctionDialogComponent, {
      width: dialogWidth('xl'),
      height: dialogHeight('l'),
      data: {
        function: $func,
        theme: this.theme,
        isReadonly: true
      } as IParticipationEditFunctionData
    });
  }

  private checkRequired(errors: IPipelineErrors): boolean {
    if (!this._functions.length) {
      errors.noFunctionsError = true;
    }
    return errors.noFunctionsError;
  }

  private checkMin(errors: IPipelineErrors): boolean {
    if (this.minFunctionsCnt && this._functions.length < this.minFunctionsCnt) {
      errors.minFunctionsError = true;
    }
    return errors.minFunctionsError;
  }

  private checkMax(errors: IPipelineErrors): boolean {
    if (this.maxFunctionsCnt && this._functions.length > this.maxFunctionsCnt) {
      errors.maxFunctionsError = true;
    }
    return errors.maxFunctionsError;
  }

  private checkTypesContinuity(errors: IPipelineErrors): boolean {
    const types: string[] = _.flatMap(this._functions.map(f => [f.inputType, f.outputType]));
    types.unshift(this.inGenFunctionType);
    types.push(this.outValFunctionType);
    for (let i = 0; i < types.length - 1; i += 2) {
      if (types[i] !== types[i + 1]) {
        errors.pipelineTypeError = true;
      }
    }
    return errors.pipelineTypeError;
  }
}
