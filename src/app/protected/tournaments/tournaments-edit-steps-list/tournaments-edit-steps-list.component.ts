import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {Form, FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-steps-list',
  templateUrl: './tournaments-edit-steps-list.component.html',
  styles: []
})
export class TournamentsEditStepsListComponent implements OnInit {

  @Input() steps: ITournamentEditionStep[] = [];
  @Input() languages: IProgrammingLanguageNavigation[] = [];
  @Input() stepsArray: FormArray;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {

  }

  getStepForm(i: number): FormGroup{
    const newStepGrp =  this.fb.group({});
    this.stepsArray.setControl(i, newStepGrp)
    return newStepGrp
  }

  drop($event: CdkDragDrop<any, any>) {
    moveItemInArray(this.steps, $event.previousIndex, $event.currentIndex);
    this.reorderSteps();
  }


  deleteStep(i: number) {
    this.steps.splice(i,1);
    this.stepsArray.removeAt(i);
    this.reorderSteps();
  }

  private reorderSteps() {
    this.steps.forEach((s, i) => s.order = i + 1);
  }
}
