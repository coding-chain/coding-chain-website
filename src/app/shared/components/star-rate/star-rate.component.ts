import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-star-rate',
  templateUrl: './star-rate.component.html',
  styles: []
})
export class StarRateComponent implements OnInit {

  @Input() maxRate = 5;

  @Output()
  rateChange = new EventEmitter<number>();
  rateValue: number;
  @Input() disabled = true;
  rateArr = [];

  constructor() {
  }

  @Input()
  get rate() {
    return this.rateValue;
  }

  set rate(val: number) {
    this.rateValue = val ?? 0;
    this.rateChange.emit(this.rateValue);
  }

  ngOnInit(): void {
    this.rateArr = new Array(this.maxRate);
  }

  setRate(i: number) {
    if (i + 1 == this.rate) {
      this.rate = i ;
    } else {
      this.rate = i + 1;
    }
    this.rateArr = new Array(this.maxRate);
  }

}
