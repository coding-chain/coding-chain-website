import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {FormArray, FormBuilder} from '@angular/forms';
import {ItemWithForm} from '../../../shared/models/forms';

@Component({
  selector: 'app-tournaments-edit-steps-list',
  templateUrl: './tournaments-edit-steps-list.component.html',
  styles: []
})
export class TournamentsEditStepsListComponent implements OnInit {

  @Input() languages: IProgrammingLanguageNavigation[] = [];
  @Input() stepsArray: FormArray;
  stepsWithForm: ItemWithForm<ITournamentEditionStep>[] = [];
  @Input() tournamentPublished = true;

  constructor(private fb: FormBuilder) {
  }

  private _steps: ITournamentEditionStep[] = [];

  @Input() set steps(steps: ITournamentEditionStep[]) {
    this._steps = steps;
    if (this.stepsArray) {
      this.setStepsWithForm();
    }
  }

  ngOnInit(): void {
    this.setStepsWithForm();
  }


  drop($event: CdkDragDrop<any, any>): void {
    moveItemInArray(this.stepsWithForm, $event.previousIndex, $event.currentIndex);
    moveItemInArray(this._steps, $event.previousIndex, $event.currentIndex);
    this.reorderSteps();
  }

  deleteStep(i: number): void {
    this._steps.splice(i, 1);
    this.stepsWithForm.splice(i, 1);
    this.stepsArray.removeAt(i);
    this.reorderSteps();
  }

  private setStepsWithForm(): void {
    this.stepsWithForm = this._steps.map(s => ({item: s, form: this.fb.group({})}));
    this.stepsWithForm.forEach((s, i) => this.stepsArray.setControl(i, s.form));
  }

  private reorderSteps(): void {
    this._steps.forEach((s, i) => s.order = i + 1);
  }
}
