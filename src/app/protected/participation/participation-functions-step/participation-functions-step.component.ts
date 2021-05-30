import {Component, OnInit} from '@angular/core';
import {AppFunction} from '../../../shared/models/function-session/responses';
import {NgFlowchart, NgFlowchartStepComponent} from '@joelwenzel/ng-flowchart';

@Component({
  selector: 'app-participation-functions-step',
  templateUrl: './participation-functions-step.component.html',
  styles: []
})
export class ParticipationFunctionsStepComponent extends NgFlowchartStepComponent implements OnInit {

  constructor() {
    super();
  }

  get func(): AppFunction {
    return this.data;
  }

  ngOnInit(): void {
  }

}
