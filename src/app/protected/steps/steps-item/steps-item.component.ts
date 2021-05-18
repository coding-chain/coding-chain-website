import {Component, Input, OnInit} from '@angular/core';
import {IStepResume} from '../../../shared/models/steps/responses';
import {Theme} from '../../../core/services/theme.service';
import {IStepsTestsDialogData, StepsTestsDialogComponent} from '../steps-edit-tests-dialog/steps-tests-dialog.component';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-steps-item',
  templateUrl: './steps-item.component.html',
  styles: []
})
export class StepsItemComponent implements OnInit {

  @Input() step: IStepResume;
  @Input() theme: Theme;

  constructor(public dialog: MatDialog) {
  }

  get languageColor(): string {
    return this.theme === 'dark' ? this.step.language.color.dark : this.step.language.color.light;
  }

  ngOnInit(): void {
    console.log(this.step);
  }

  openTestsDialog(): void {
    const dialogRef = this.dialog.open(StepsTestsDialogComponent, {
      width: dialogWidth('xxl'),
      height: dialogHeight('xl'),
      data: {step: this.step, theme: this.theme, readonly: true} as IStepsTestsDialogData
    });
  }

}
