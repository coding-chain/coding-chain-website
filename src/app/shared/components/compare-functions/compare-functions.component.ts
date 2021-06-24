import {Component, Input, OnInit} from '@angular/core';
import {AppFunction} from '../../models/function-session/app-function';
import {getDefaultMonacoEditorConfig} from '../../utils/monaco.utils';
import {Theme} from '../../../core/services/states/theme.service';
import {MonacoEditorConstructionOptions} from '@materia-ui/ngx-monaco-editor/lib/interfaces';

@Component({
  selector: 'app-compare-functions',
  templateUrl: './compare-functions.component.html',
  styles: []
})
export class CompareFunctionsComponent implements OnInit {

  @Input() sourceFunction: AppFunction;
  @Input() otherFunction: AppFunction;
  @Input() theme: Theme;
  monacoOptions: MonacoEditorConstructionOptions;

  constructor() {
  }

  ngOnInit(): void {
    this.monacoOptions = getDefaultMonacoEditorConfig(this.sourceFunction.language, this.theme);
  }

}
