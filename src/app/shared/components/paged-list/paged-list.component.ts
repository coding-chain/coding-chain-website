import {Component, Input, OnInit} from '@angular/core';
import {PageCursor} from '../../models/pagination/page-cursor';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-paged-list',
  templateUrl: './paged-list.component.html',
  styleUrls: ['./paged-list.component.scss']
})
export class PagedListComponent implements OnInit {

  @Input()
  cursor: PageCursor<any, any>;


  @Input()
  disabled = false;


  constructor() {
  }

  ngOnInit(): void {
  }

  changePage(page: number) {
    this.cursor?.toPage(page);
  }

  updateCursor($event: PageEvent) {
    this.cursor.setPageSizeAndPage($event.pageSize, $event.pageIndex + 1);
  }
}
