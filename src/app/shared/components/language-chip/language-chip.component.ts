import {Component, Input, OnInit} from '@angular/core';
import {IStepResume} from '../../models/steps/responses';
import {Theme} from '../../../core/services/states/theme.service';
import {MatDialog} from '@angular/material/dialog';
import {
  IStepsTestsDialogData,
  StepsTestsDialogComponent
} from '../../../protected/steps/steps-edit-tests-dialog/steps-tests-dialog.component';
import {dialogHeight, dialogWidth} from '../../utils/dialogs.utils';
import {IProgrammingLanguage} from '../../models/programming-languages/responses';

@Component({
  selector: 'app-language-chip',
  templateUrl: './language-chip.component.html',
  styles: [
  ]
})
export class LanguageChipComponent implements OnInit {

  @Input() language: IProgrammingLanguage;
  @Input() theme: Theme;

  constructor(public dialog: MatDialog) {
  }

  get languageColor(): string {
    return this.theme === 'dark' ? this.language.color.dark : this.language.color.light;
  }

  ngOnInit(): void {
  }
}
