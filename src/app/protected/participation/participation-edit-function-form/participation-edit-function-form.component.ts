import {Component, Input, OnInit} from '@angular/core';
import {AppFunction} from '../../../shared/models/function-session/responses';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppLanguage} from '../../../shared/models/programming-languages/responses';
import {getDefaultMonacoEditorConfig} from '../../../shared/utils/monaco.utils';
import {Theme} from '../../../core/services/states/theme.service';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';
import {funcValidate} from '../../../shared/validators/function.validator';

@Component({
  selector: 'app-participation-edit-function-form',
  templateUrl: './participation-edit-function-form.component.html',
  styles: []
})
export class ParticipationEditFunctionFormComponent implements OnInit {

  @Input() func: AppFunction;
  @Input() form: FormGroup;
  @Input() theme: Theme;
  editorConfig: MonacoEditorConstructionOptions;
  codeCtrl: FormControl;

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.editorConfig = getDefaultMonacoEditorConfig(this.func.language, this.theme);
    this.codeCtrl = this._fb.control(this.func.editorCode, funcValidate(this.func));
    this.form.setControl('code', this.codeCtrl);
  }

}
