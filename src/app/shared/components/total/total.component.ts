import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss']
})
export class TotalComponent implements OnInit {

  @Input()
  total: number;

  @Input()
  totalTipMsg: string;


  @Input()
  cnt: number;

  @Input()
  cntTipMsg: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
