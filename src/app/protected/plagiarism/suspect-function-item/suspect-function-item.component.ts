import {Component, Input, OnInit} from '@angular/core';
import {ISuspectFunction} from '../../../shared/models/plagiarism/responses';
import {Theme} from '../../../core/services/states/theme.service';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';
import {AppFunction} from '../../../shared/models/function-session/app-function';

@Component({
  selector: 'app-suspect-function-item',
  templateUrl: './suspect-function-item.component.html',
  styles: []
})
export class SuspectFunctionItemComponent implements OnInit {
  @Input() theme: Theme;
  @Input() suspectFunction: ISuspectFunction;

  suspectAppFunction: AppFunction;

  constructor() {
  }

  ngOnInit(): void {
    this.suspectAppFunction = FunctionFactory.new({
      code: this.suspectFunction.code,
      type: 'pipeline',
      language: this.suspectFunction.language.name
    }).parse();
  }

}
