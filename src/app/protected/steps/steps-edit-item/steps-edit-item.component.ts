import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {StepsEditDetailDialogComponent} from '../steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {StepsEditTestsDialogComponent} from '../steps-edit-tests-dialog/steps-edit-tests-dialog.component';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {gtCtrlValidator, ltCtrlValidator} from '../../../shared/validators/number.validators';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {dialogSize} from '../../../shared/utils/dialogs';


@Component({
  selector: 'app-steps-edit-item',
  templateUrl: './steps-edit-item.component.html',
  styles: []
})
export class StepsEditItemComponent implements OnInit {
  @Input() maxNameLength = 50;
  @Input() minNameLength = 5;
  @Input() languages: IProgrammingLanguageNavigation[] = [];
  @Output() formGroupReady = new EventEmitter<FormGroup>();
  @Output() stepDeleted = new EventEmitter();

  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  isOptionalCtrl: FormControl;
  maxFunctionsCntCtrl: FormControl;
  minFunctionsCntCtrl: FormControl;
  languagesCtrl: FormControl;
  private stepGrp: FormGroup;

  constructor(private _fb: FormBuilder, public dialog: MatDialog) {
    this.nameCtrl = this._fb.control('', [Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);
    this.isOptionalCtrl = this._fb.control(true);
    this.maxFunctionsCntCtrl = this._fb.control(true);
    this.minFunctionsCntCtrl = this._fb.control(true);
    this.minFunctionsCntCtrl.setValidators([gtCtrlValidator(this.maxFunctionsCntCtrl), Validators.min(0)]);
    this.maxFunctionsCntCtrl.setValidators([ltCtrlValidator(this.minFunctionsCntCtrl), Validators.min(0)]);
    this.languagesCtrl = this._fb.control([], [Validators.required]);

    this.stepGrp = this._fb.group({
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      isOptional: this.isOptionalCtrl,
      languageId: this.languagesCtrl,
      minFunctionsCount: this.minFunctionsCntCtrl,
      maxFunctionsCount: this.maxFunctionsCntCtrl
    });
  }

  _step: ITournamentEditionStep;

  @Input() set step(step: ITournamentEditionStep) {
    this._step = step;
    this.nameCtrl.setValue(step.name);
    this.isOptionalCtrl.setValue(step.isOptional);
    this.minFunctionsCntCtrl.setValue(step.minFunctionsCount);
    this.maxFunctionsCntCtrl.setValue(step.maxFunctionsCount);
    if (step?.language?.id) {
      this.languagesCtrl.setValue(step.language.id);
    }
    this.nameCtrl.markAsTouched();
    this.languagesCtrl.markAsTouched();
    this.stepGrp.valueChanges.subscribe((val: ITournamentEditionStep) => {
      this._step.name = val?.name;
      this._step.isOptional = val?.isOptional;
      this._step.minFunctionsCount = val?.minFunctionsCount;
      this._step.maxFunctionsCount = val?.maxFunctionsCount;
      this._step.languageId = val?.languageId;
    });
  }

  openDetailDialog(): void {
    const dialogRef = this.dialog.open(StepsEditDetailDialogComponent, {
      width: dialogSize('m'),
      data: this._step
    });

    dialogRef.afterClosed().subscribe((result: (ITournamentEditionStep | undefined)) => {
      if (result) {
        this.step.description = result.description;
      }
    });
  }

  openTestsDialog(): void {
    const dialogRef = this.dialog.open(StepsEditTestsDialogComponent, {
      width: dialogSize('xl'),
      data: this._step
    });

    dialogRef.afterClosed().subscribe((result: (ITournamentEditionStep | undefined)) => {
      if (result) {
        this.step.description = result.description;
      }
    });
  }


  ngOnInit(): void {
    this.formGroupReady.emit(this.stepGrp);
  }

  delete() {
    this.stepDeleted.emit();
  }
}
