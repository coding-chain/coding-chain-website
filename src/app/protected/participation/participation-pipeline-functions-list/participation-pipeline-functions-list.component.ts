import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppFunction} from '../../../shared/models/function-session/responses';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-participation-pipeline-functions-list',
  templateUrl: './participation-pipeline-functions-list.component.html',
  styles: []
})
export class ParticipationPipelineFunctionsListComponent implements OnInit {

  @Output() functionUpdate = new EventEmitter<AppFunction>();

  constructor() {
  }

  _functions: AppFunction[] = [];

  @Input() set functions(functions: AppFunction[]) {
    this._functions = functions.map(f => AppFunction.new(f).parse());
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<AppFunction[]>): void {
    const movedFunction = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this._functions.forEach((f, i) => {
      if (movedFunction.id === f.id) {
        movedFunction.order = i + 1;
      }
    });
    this.functionUpdate.emit(movedFunction);
  }
}
