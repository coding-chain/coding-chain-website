import {Component, Input, OnInit} from '@angular/core';
import {IStepNavigation} from '../../../shared/models/steps/responses';

@Component({
  selector: 'app-tournament-summary-steps-list',
  templateUrl: './tournament-summary-steps-list.component.html',
  styles: []
})
export class TournamentSummaryStepsListComponent implements OnInit {
  @Input() steps: IStepNavigation[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
