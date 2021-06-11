import {Component, Input, OnInit} from '@angular/core';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {ITournamentResumeStep} from '../../../shared/models/tournaments/tournament-resume';

@Component({
  selector: 'app-tournament-summary-steps-list',
  templateUrl: './tournament-summary-steps-list.component.html',
  styles: []
})
export class TournamentSummaryStepsListComponent implements OnInit {
  @Input() steps: ITournamentResumeStep[];

  constructor() {
  }

  ngOnInit(): void {
  }
}
