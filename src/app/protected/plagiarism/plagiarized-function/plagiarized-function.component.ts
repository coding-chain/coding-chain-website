import {Component, Input, OnInit} from '@angular/core';
import {IPlagiarizedFunction} from '../../../shared/models/plagiarism/responses';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';
import {Theme} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-plagiarized-function',
  templateUrl: './plagiarized-function.component.html',
  styles: []
})
export class PlagiarizedFunctionComponent implements OnInit {
  @Input() theme: Theme;
  @Input() plagiarizedFunction: IPlagiarizedFunction;
  plagiarizedAppFunction: AppFunction;
  rate: number;

  constructor() {
  }

  ngOnInit(): void {
    this.plagiarizedAppFunction = FunctionFactory.new({
      code: this.plagiarizedFunction.code,
      type: 'pipeline',
      language: this.plagiarizedFunction.language.name
    }).parse();
    this.rate = this.plagiarizedFunction.rate * 100;
  }

  compareFunctions(): void {

  }
}
