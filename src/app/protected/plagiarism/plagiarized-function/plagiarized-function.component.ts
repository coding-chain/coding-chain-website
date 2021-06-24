import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPlagiarizedFunction} from '../../../shared/models/plagiarism/responses';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';
import {Theme} from '../../../core/services/states/theme.service';
import {CheckItem} from '../../../shared/models/forms';

@Component({
  selector: 'app-plagiarized-function',
  templateUrl: './plagiarized-function.component.html',
  styles: []
})
export class PlagiarizedFunctionComponent implements OnInit {
  @Input() theme: Theme;
  @Input() plagiarizedFunction: CheckItem<IPlagiarizedFunction>;
  @Output() compareFunctions = new EventEmitter<AppFunction>();
  plagiarizedAppFunction: AppFunction;
  rate: number;

  constructor() {
  }

  ngOnInit(): void {
    this.plagiarizedAppFunction = FunctionFactory.new({
      code: this.plagiarizedFunction.item.code,
      type: 'pipeline',
      language: this.plagiarizedFunction.item.language.name
    }).parse();
    this.rate = this.plagiarizedFunction.item.rate * 100;
  }

  compareFunctionsClicked(): void {
    this.compareFunctions.emit(this.plagiarizedAppFunction);
  }
}
