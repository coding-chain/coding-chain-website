import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-steps-list',
  templateUrl: './tournaments-edit-steps-list.component.html',
  styles: []
})
export class TournamentsEditStepsListComponent implements OnInit {

  @Input() steps: ITournamentEditionStep[] = [];
  @Input() languages: IProgrammingLanguageNavigation[] = [];
  @Output() stepsArrReady = new EventEmitter<FormArray>();
  private _stepsArr: FormArray;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._stepsArr = this.fb.array([]);
    this.stepsArrReady.emit(this._stepsArr);
  }

  drop($event: CdkDragDrop<any, any>) {
    moveItemInArray(this.steps, $event.previousIndex, $event.currentIndex);
    this.reorderSteps();
  }

  addStepFormGrp($formGrp: FormGroup, i: number) {
    this._stepsArr.insert(i,$formGrp);
  }

  deleteStep(i: number) {
    this.steps.splice(i,1);
    this._stepsArr.removeAt(i);
    this.reorderSteps();
  }

  private reorderSteps() {
    this.steps.forEach((s, i) => s.order = i + 1);
  }
}
