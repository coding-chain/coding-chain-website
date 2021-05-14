import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';

@Component({
  selector: 'app-steps-transfer',
  templateUrl: './steps-transfer.component.html',
  styles: []
})
export class StepsTransferComponent implements OnInit {

  @Input() languages: IProgrammingLanguageNavigation[];
  @Output()
  selectedStepsChange = new EventEmitter<IStepNavigation[]>();
  selectedStepsValue: IStepNavigation[];
  @Input() disabled = true;

  constructor() {
  }

  @Input()
  get selectedSteps() {
    return this.selectedStepsValue;
  }

  set selectedSteps(steps: IStepNavigation[]) {
    this.selectedStepsValue = steps ?? [];
    this.selectedStepsChange.emit(this.selectedStepsValue);
  }

  ngOnInit(): void {
  }

}
