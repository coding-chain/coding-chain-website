import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';

@Component({
  selector: 'app-tournaments-edit-steps-list',
  templateUrl: './tournaments-edit-steps-list.component.html',
  styles: [
  ]
})
export class TournamentsEditStepsListComponent implements OnInit {

  @Input() steps: ITournamentEditionStep[] = []
  @Input() languages: IProgrammingLanguageNavigation[] = []
  constructor() { }

  ngOnInit(): void {
  }

  drop($event: CdkDragDrop<any, any>) {
    moveItemInArray(this.steps, $event.previousIndex, $event.currentIndex);
    this.steps.forEach((s,i) => s.order = i+1);
  }

}
