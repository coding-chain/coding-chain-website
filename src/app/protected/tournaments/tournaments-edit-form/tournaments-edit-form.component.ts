import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {BehaviorSubject} from 'rxjs';
import {minDate, validateDateBetween} from '../../../shared/validators/date.validators';
import {delay, map} from 'rxjs/operators';
import {dialogSize} from '../../../shared/utils/dialogs';
import {IStepsTransferDialogData, StepsTransferDialogComponent} from '../../steps/steps-list-dialog/steps-transfer-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {IStepNavigation} from '../../../shared/models/steps/responses';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit {

  @Input() tournament: ITournamentEdition;


  @Input() languages: IProgrammingLanguageNavigation[] = [];

  formGroup: FormGroup;
  isInvalid$ = new BehaviorSubject(true);
  startDateCtrl: FormControl;
  endDateCtrl: FormControl;
  isPublishedCtrl: FormControl;
  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  stepsArray: FormArray;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.startDateCtrl = this.fb.control(this.tournament.startDate, [minDate(new Date())]);
    this.endDateCtrl = this.fb.control(this.tournament.endDate);
    this.isPublishedCtrl = this.fb.control(this.tournament.isPublished);
    this.descriptionCtrl = this.fb.control(this.tournament.description);
    this.nameCtrl = this.fb.control(this.tournament.name);
    this.stepsArray = this.fb.array([]);
    this.startDateCtrl.valueChanges.pipe(
      map(textDate => {
        if (textDate) {
          return new Date(textDate);
        }
      })
    );
    this.formGroup = this.fb.group({
      startDate: this.startDateCtrl,
      endDate: this.endDateCtrl,
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      steps: this.stepsArray
    }, {validators: validateDateBetween(this.startDateCtrl, this.endDateCtrl)});
    this.formGroup.valueChanges.pipe(delay(100)).subscribe((res: ITournamentEdition) => {
      this.isInvalid$.next(this.formGroup.invalid);
    });
    if (this.tournament.isPublished) {
      this.formGroup.disable();
      this.isPublishedCtrl.disable();
    }
  }


  addStep() {
    this.tournament.steps.push({language: {}, order: this.tournament.steps.length + 1, tests: []} as ITournamentEditionStep);
    this.isInvalid$.next(false);
  }

  openStepsListDialog(): void {

    const dialogRef = this.dialog.open(StepsTransferDialogComponent, {
      width: dialogSize('xl'),
      data: {currentSteps: this.tournament.steps.filter(s => !!s.id), languages: this.languages} as IStepsTransferDialogData
    });

    dialogRef.afterClosed().subscribe((selectedSteps: IStepNavigation[]) => {
      selectedSteps.forEach(selectedStep => {
        if (!this.tournament.steps.some(step => step.id == selectedStep.id)) {
          this.tournament.steps.unshift({
            isOptional: true,
            order: 0,
            stepId: selectedStep.id,
            tournamentId: selectedStep.id, ...selectedStep
          } as ITournamentEditionStep);
        }
      })
    });
  }


}
