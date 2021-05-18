import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {BehaviorSubject} from 'rxjs';
import {minDate, validateDateBetween} from '../../../shared/validators/date.validators';
import {delay} from 'rxjs/operators';
import {dialogHeight, dialogWidth} from '../../../shared/utils/dialogs.utils';
import {IStepsTransferDialogData, StepsTransferDialogComponent} from '../../steps/steps-transfer-dialog/steps-transfer-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {dateTimeToString} from '../../../shared/utils/date.utils';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit, OnChanges {

  @Input() tournament: ITournamentEdition;
  @Output() tournamentSave = new EventEmitter<ITournamentEdition>();
  @Output() addExistingStep = new EventEmitter<ITournamentEditionStep>();

  @Input() languages: IProgrammingLanguageNavigation[] = [];

  formGroup: FormGroup;
  isInvalid$ = new BehaviorSubject(true);
  startDateCtrl: FormControl;
  endDateCtrl: FormControl;
  isPublishedCtrl: FormControl;
  nameCtrl: FormControl;
  descriptionCtrl: FormControl;
  stepsArray: FormArray;
  tournamentPublished = true;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.setForm();
  }

  addStep(): void {
    this.tournament.steps.push({
      language: {},
      order: this.tournament.steps.length + 1,
      tests: [],
      isOptional: true
    } as ITournamentEditionStep);
    this.tournament.steps = [...this.tournament.steps];
    this.isInvalid$.next(true);
  }

  openStepsListDialog(): void {

    const dialogRef = this.dialog.open(StepsTransferDialogComponent, {
      width: dialogWidth('xl'),
      height: dialogHeight('xl'),
      data: {currentSteps: this.tournament.steps.filter(s => !!s.id), languages: this.languages} as IStepsTransferDialogData
    });

    dialogRef.afterClosed().subscribe((selectedSteps: IStepNavigation[]) => {
      const newSteps = selectedSteps?.filter(selectedStep => !this.tournament.steps.some(step => step.id === selectedStep.id));
      const newTournamentSteps = newSteps.map(newStep => ({
        isOptional: true,
        order: 0,
        stepId: newStep.id,
        ...newStep
      } as ITournamentEditionStep));
      newTournamentSteps.forEach(s => this.tournament.steps.unshift(s));
      this.tournament.steps.forEach((s, i) => s.order = i + 1);
      this.tournament.steps = [...this.tournament.steps];
      newTournamentSteps.forEach(s => this.addExistingStep.emit(s));
    });
  }

  saveTournament(): void {
    this.tournamentSave.emit(this.tournament);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setForm();
  }

  private setForm(): void {
    this.tournamentPublished = this.tournament.isPublished;
    this.startDateCtrl = this.fb.control(dateTimeToString(this.tournament.startDate), [minDate(new Date())]);
    this.endDateCtrl = this.fb.control(dateTimeToString(this.tournament.endDate));
    this.isPublishedCtrl = this.fb.control(this.tournament.isPublished);
    this.descriptionCtrl = this.fb.control(this.tournament.description);
    this.nameCtrl = this.fb.control(this.tournament.name);
    this.stepsArray = this.fb.array([]);
    this.formGroup = this.fb.group({
      startDate: this.startDateCtrl,
      endDate: this.endDateCtrl,
      name: this.nameCtrl,
      description: this.descriptionCtrl,
      steps: this.stepsArray,
      isPublished: this.isPublishedCtrl
    }, {validators: validateDateBetween(this.startDateCtrl, this.endDateCtrl)});
    this.formGroup.valueChanges.pipe(delay(100)).subscribe((res: ITournamentEdition) => {
      this.tournament.startDate = new Date(res.startDate);
      this.tournament.endDate = res.endDate;
      this.tournament.name = res.name;
      this.tournament.description = res.description;
      this.tournament.isPublished = res.isPublished;
      this.isInvalid$.next(this.formGroup.invalid);
    });
    if (this.tournament.isPublished) {
      this.formGroup.disable();
      this.isPublishedCtrl.disable();
    }
  }

}
