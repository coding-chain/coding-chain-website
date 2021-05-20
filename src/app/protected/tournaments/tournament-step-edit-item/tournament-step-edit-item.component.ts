import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {
  IStepsEditDetailDialogData,
  StepsEditDetailDialogComponent
} from '../../steps/steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {IStepsTestsDialogData, StepsTestsDialogComponent} from '../../steps/steps-edit-tests-dialog/steps-tests-dialog.component';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {ThemeService} from '../../../core/services/theme.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-tournament-step-edit-item',
  templateUrl: './tournament-step-edit-item.component.html',
  styles: []
})
export class TournamentStepEditItemComponent implements OnInit {
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
  @Input() tournamentPublished = true;

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private readonly _themeService: ThemeService) {

  }

  openDetailDialog(): void {
    const dialogRef = this.dialog.open(StepsEditDetailDialogComponent, {
      width: dialogWidth('xl'),
      height: dialogHeight('l'),
      data: {step: this.step, theme: this._themeService.theme} as IStepsEditDetailDialogData
    });
    this._themeService.publishTheme();

    dialogRef.afterClosed().subscribe((result: (ITournamentEditionStep | undefined)) => {
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
    this.isOptionalCtrl = this._fb.control(!this.step.isOptional);
    this.isOptionalCtrl.valueChanges.pipe(map(isOptional => !isOptional));
    this.languagesCtrl = this._fb.control(this.languages?.find(l => this.step.language?.id === l.id), [Validators.required]);
    this.scoreCtrl = this._fb.control(this.step.score ?? 0, [Validators.min(0)]);

    this.languagesCtrl.markAsTouched();
    this.nameCtrl.markAsTouched();
    this.stepGrp.setControl('name', this.nameCtrl);
    this.stepGrp.setControl('isOptional', this.isOptionalCtrl);
    this.stepGrp.setControl('languageId', this.languagesCtrl);
    this.stepGrp.setControl('score', this.scoreCtrl);
    if (this.step.isPublished) {
      this.stepGrp.disable();
      if (!this.tournamentPublished) {
        this.isOptionalCtrl.enable();
      }
    }
    this.descriptionCtrl = this._fb.control(this.step.description, [Validators.required]);
    this.stepGrp.setControl('description', this.descriptionCtrl);

    this.stepGrp.valueChanges.subscribe((res: ITournamentEditionStep) => {
      this.step.name = res.name;
      this.step.description = res.description;
      this.step.isOptional = !res.isOptional;
      this.step.language = this.languagesCtrl.value;
      this.step.score = res.score;
    });
  }

  delete(): void {
    this.stepDeleted.emit();
  }
}
