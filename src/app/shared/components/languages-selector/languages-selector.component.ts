import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';

export interface ISelectableLanguage {
  id: string;
  name: string;
}

@Component({
  selector: 'app-languages-selector',
  templateUrl: './languages-selector.component.html',
  styles: []
})
export class LanguagesSelectorComponent implements OnInit {

  @Output() languagesCtrlReady = new EventEmitter<FormControl>();

  @Input() languages: ISelectableLanguage[] = [];

  languageCtrl: FormControl;

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.languageCtrl = this._fb.control(null);
    this.languagesCtrlReady.emit(this.languageCtrl);
  }

}
