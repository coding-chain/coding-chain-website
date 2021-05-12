import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SortOrder} from '../../types/sort-order';

@Component({
  selector: 'app-sort-by-arrows',
  templateUrl: './sort-by-arrows.component.html',
  styles: []
})
export class SortByArrowsComponent implements OnInit {

  @Input() order: SortOrder = 'asc';

  @Output() orderChanged = new EventEmitter<SortOrder>();

  constructor() {
  }

  ngOnInit(): void {
  }

  switchOrder() {
    if (this.order === 'asc') {
      this.order = 'desc';
    } else {
      this.order = 'asc';
    }
    this.orderChanged.emit(this.order);
  }
}
