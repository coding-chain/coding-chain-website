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
  @Input() dim: string;
  @Input() orientation: 'vertical' | 'horizontal' = 'horizontal';

  constructor() {
  }

  get rate(): number {
    return this.rateValue;
  }

  @Input()
  set rate(val: number) {
    this.rateValue = val ?? 0;
    this.rateChange.emit(this.rateValue);
  }

  ngOnInit(): void {
    this.rateArr = new Array(this.maxRate);
  }

  setRate(i: number): void {
    if (this.disabled) {
      return;
    }
    if (i + 1 === this.rate) {
      this.rate = i;
    } else {
      this.rate = i + 1;
    }
    this.rateArr = new Array(this.maxRate);
  }

}
