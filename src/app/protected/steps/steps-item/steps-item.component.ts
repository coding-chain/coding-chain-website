import {Component, Input, OnInit} from '@angular/core';
import {IStepNavigation} from '../../../shared/models/steps/responses';

@Component({
  selector: 'app-steps-item',
  templateUrl: './steps-item.component.html',
  styles: [
  ]
})
export class StepsItemComponent implements OnInit {

  @Input() step: IStepNavigation;

  constructor() { }

  ngOnInit(): void {
  }

}
