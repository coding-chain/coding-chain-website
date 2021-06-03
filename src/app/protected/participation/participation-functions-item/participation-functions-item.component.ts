import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppFunction} from '../../../shared/models/function-session/app-function';

@Component({
  selector: 'app-participation-functions-item',
  templateUrl: './participation-functions-item.component.html',
  styleUrls: ['./participation-functions-item.component.scss'
  ]
})
export class ParticipationFunctionsItemComponent implements OnInit {

  @Input() func: AppFunction;
  @Output() edit = new EventEmitter<AppFunction>();
  @Output() display = new EventEmitter<AppFunction>();
  @Output() delete = new EventEmitter<AppFunction>();
  @Input() canEdit = true;
  @Input() canRemove = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  onRemoveClicked(): void {
    this.delete.emit(this.func);
  }

  onEditClicked(): void {
    this.edit.emit(this.func);
  }
  onDisplayClicked(): void {
    this.display.emit(this.func);
  }
}
