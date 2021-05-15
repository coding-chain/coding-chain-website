import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';
import {Theme} from '../../../core/services/theme.service';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';
import {getDefaultMonacoEditorConfig} from '../../../shared/utils/monaco.utils';

@Component({
  selector: 'app-steps-test-edit-item',
  templateUrl: './steps-test-edit-item.component.html',
  styles: []
})
export class StepsTestEditItemComponent implements OnInit {

  @Input() test: ITestEdition;
  @Input() theme: Theme;
  @Input() testGrp: FormGroup;
  @Output() testDelete = new EventEmitter<boolean>();
  scoreCtrl: FormControl;
  inputMonacoOptions: MonacoEditorConstructionOptions;
  outputMonacoOptions: MonacoEditorConstructionOptions;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.inputMonacoOptions = getDefaultMonacoEditorConfig(this.test.language.name, this.theme);
    this.outputMonacoOptions = getDefaultMonacoEditorConfig(this.test.language.name, this.theme);
    this.scoreCtrl = this._fb.control(this.test.score ?? 1, [Validators.min(0)]);
    this.testGrp.setControl('score', this.scoreCtrl);
  }

  deleteTest(): void {
    this.testDelete.emit(true);
  }
}
