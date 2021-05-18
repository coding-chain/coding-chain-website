import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';
import {Theme} from '../../../core/services/theme.service';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';
import {getDefaultMonacoEditorConfig} from '../../../shared/utils/monaco.utils';

@Component({
  selector: 'app-steps-test-edit-item',
  templateUrl: './steps-test-edit-item.component.html'
})
export class StepsTestEditItemComponent implements OnInit {

  @Input() test: ITestEdition;
  @Input() theme: Theme;
  @Input() testGrp: FormGroup;
  @Output() testDelete = new EventEmitter<boolean>();

  scoreCtrl: FormControl;
  outputValidatorCtrl: FormControl;
  inputMonacoOptions: MonacoEditorConstructionOptions;
  outputMonacoOptions: MonacoEditorConstructionOptions;
  inputGeneratorCtrl: FormControl;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.inputMonacoOptions = getDefaultMonacoEditorConfig(this.test.language.name, this.theme);
    this.outputMonacoOptions = getDefaultMonacoEditorConfig(this.test.language.name, this.theme);
    this.outputValidatorCtrl = this._fb.control(this.test.outputValidator, [Validators.required]);
    this.inputGeneratorCtrl = this._fb.control(this.test.inputGenerator, [Validators.required]);
    this.scoreCtrl = this._fb.control(this.test.score ?? 1, [Validators.min(0)]);
    this.testGrp.setControl('score', this.scoreCtrl);
    this.testGrp.setControl('inputGenerator', this.inputGeneratorCtrl);
    this.testGrp.setControl('outputValidator', this.outputValidatorCtrl);
    this.inputMonacoOptions.readOnly = this.test.stepPublished;
    this.outputMonacoOptions.readOnly = this.test.stepPublished;
    if (this.test.stepPublished) {
      this.testGrp.disable();
    }
    this.testGrp.valueChanges.subscribe((res: ITestEdition) => {
      this.test.score = res.score;
      this.test.outputValidator = res.outputValidator;
      this.test.inputGenerator = res.inputGenerator;
    });
  }

  deleteTest(): void {
    this.testDelete.emit(true);
  }
}
