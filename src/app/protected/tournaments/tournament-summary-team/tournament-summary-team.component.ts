import {Component, Input, OnInit} from '@angular/core';
import {ITeamNavigation} from '../../../shared/models/teams/responses';

@Component({
  selector: 'app-tournament-summary-team',
  templateUrl: './tournament-summary-team.component.html',
  styles: []
})
export class TournamentSummaryTeamComponent implements OnInit {
  @Input() team: ITeamNavigation;

  constructor() {
  }

  ngOnInit(): void {
  }

}
