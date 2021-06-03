import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {getDefaultMonacoEditorConfig} from '../../../shared/utils/monaco.utils';
import {Theme} from '../../../core/services/states/theme.service';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';
import {funcValidate, readonlyHeader} from '../../../shared/validators/function.validator';
import {debounceTime} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppFunction} from '../../../shared/models/function-session/app-function';

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
  @ViewChild('formErrors') errTemplate: TemplateRef<any>;

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.editorConfig = getDefaultMonacoEditorConfig(this.func.language, this.theme);
    this.codeCtrl = this._fb.control(this.func.editorCode, [readonlyHeader(this.func), funcValidate(this.func)]);
    this.form.setControl('code', this.codeCtrl);

  }


}
