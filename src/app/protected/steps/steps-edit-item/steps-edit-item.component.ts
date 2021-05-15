import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {IStepsEditDetailDialogData, StepsEditDetailDialogComponent} from '../steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {IStepsEditTestsDialogData, StepsEditTestsDialogComponent} from '../steps-edit-tests-dialog/steps-edit-tests-dialog.component';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {dialogWidth} from '../../../shared/utils/dialogs.utils';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {ThemeService} from '../../../core/services/theme.service';


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
  isOptionalCtrl: FormControl;
  languagesCtrl: FormControl;
  scoreCtrl: FormControl;

  @Input() stepGrp: FormGroup;
  @Input() step: ITournamentEditionStep;

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private readonly _themeService: ThemeService) {

  }

  openDetailDialog(): void {
    const dialogRef = this.dialog.open(StepsEditDetailDialogComponent, {
      width: dialogWidth('xl'),
      data: {step: this.step, theme: this._themeService.theme} as IStepsEditDetailDialogData
    });
    this._themeService.publishTheme();

    dialogRef.afterClosed().subscribe((result: (ITournamentEditionStep | undefined)) => {
      if (result) {
        this.step.description = result.description;
        this.step.minFunctionsCount = result.minFunctionsCount;
        this.step.maxFunctionsCount = result.maxFunctionsCount;
      }
    });
  }

  openTestsDialog(): void {
    const dialogRef = this.dialog.open(StepsEditTestsDialogComponent, {
      width: dialogWidth('xxl'),
      data: {step: this.step, theme: this._themeService.theme} as IStepsEditTestsDialogData
    });

    dialogRef.afterClosed().subscribe((result: (ITestNavigation[] | undefined)) => {
      if (result) {
        this.step.tests = result;
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
    this.isOptionalCtrl = this._fb.control(this.step.isOptional);
    this.languagesCtrl = this._fb.control(this.step.language.id, [Validators.required]);
    this.scoreCtrl = this._fb.control(this.step.score ?? 0, [Validators.min(0)]);

    this.stepGrp.setControl('name', this.nameCtrl);
    this.stepGrp.setControl('description', this.descriptionCtrl);
    this.stepGrp.setControl('isOptional', this.isOptionalCtrl);
    this.stepGrp.setControl('languageId', this.languagesCtrl);
    this.stepGrp.setControl('score', this.scoreCtrl);
    if (this.step.isPublished) {
      this.stepGrp.disable();
      this.isOptionalCtrl.enable();
    }

    this.stepGrp.valueChanges.subscribe(res => console.log(this.step));
  }

  delete(): void {
    this.stepDeleted.emit();
  }
}
