import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ThemeService} from '../../../core/services/states/theme.service';
import {IStepsEditDetailDialogData, StepsEditDetailDialogComponent} from '../steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {IStepsTestsDialogData, StepsTestsDialogComponent} from '../steps-edit-tests-dialog/steps-tests-dialog.component';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {IStepResume} from '../../../shared/models/steps/responses';

@Component({
  selector: 'app-steps-edit-item',
  templateUrl: './steps-edit-item.component.html',
  styles: []
})
export class StepsEditItemComponent implements OnInit {


  @Input() maxNameLength = 50;
  @Input() minNameLength = 5;
  @Input() minDifficulty = 1;
  @Input() maxDifficulty = 10;

  @Input() languages: IProgrammingLanguageNavigation[] = [];
  @Output() stepDeleted = new EventEmitter();

  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  languagesCtrl: FormControl;
  scoreCtrl: FormControl;

  stepGrp: FormGroup;
  @Input() step: IStepResume;
  @Output() stepSave = new EventEmitter();

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private readonly _themeService: ThemeService) {

  }

  openDetailDialog(): void {
    const dialogRef = this.dialog.open(StepsEditDetailDialogComponent, {
      width: dialogWidth('xl'),
      height: dialogHeight('l'),
      data: {step: this.step, theme: this._themeService.theme} as IStepsEditDetailDialogData
    });
    this._themeService.publishTheme();

    dialogRef.afterClosed().subscribe((result: (IStepResume | undefined)) => {
      if (result) {
        this.descriptionCtrl.setValue(result.description);
        this.step.minFunctionsCount = result.minFunctionsCount;
        this.step.maxFunctionsCount = result.maxFunctionsCount;
      }
    });
  }

  openTestsDialog(): void {
    const dialogRef = this.dialog.open(StepsTestsDialogComponent, {
      width: dialogWidth('xxl'),
      height: dialogHeight('xl'),
      data: {step: this.step, theme: this._themeService.theme, readonly: this.step.isPublished} as IStepsTestsDialogData
    });

    dialogRef.afterClosed().subscribe((result: (ITestNavigation[] | undefined)) => {
      if (result) {
        this.step.tests = result;
        this.stepGrp.updateValueAndValidity();
      }
    });
  }


  ngOnInit(): void {
    this.step.difficulty ??= 1;
    this.nameCtrl = this._fb.control(this.step.name, [
      Validators.required,
      Validators.minLength(this.minNameLength),
      Validators.maxLength(this.maxNameLength)
    ]);
    this.languagesCtrl = this._fb.control(this.step.language?.id, [Validators.required]);
    this.scoreCtrl = this._fb.control(this.step.score ?? 0, [Validators.min(0)]);
    this.descriptionCtrl = this._fb.control(this.step.description, [Validators.required]);

    this.stepGrp = this._fb.group({
      name: this.nameCtrl,
      languageId: this.languagesCtrl,
      score: this.scoreCtrl
    });
    if (this.step.isPublished) {
      this.stepGrp.disable();
    }
    this.stepGrp.setControl('description', this.descriptionCtrl);

    this.stepGrp.valueChanges.subscribe((res: IStepResume) => {
      this.step.name = res.name;
      this.step.description = res.description;
      this.step.languageId = res.languageId;
      this.step.score = res.score;
      this.validateTestsLength();
    });
    this.stepGrp.setValidators((control => this.validateTestsLength()));
  }

  delete(): void {
    this.stepDeleted.emit();
  }

  saveStep(): void {
    this.stepSave.emit();
  }


  private validateTestsLength(): ValidationErrors {
    if (this.step.tests.length <= 0) {
      return {minTestsLengthError: true};
    }
  }
}
