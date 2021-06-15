import {Component, Input, OnInit} from '@angular/core';
import {ITournamentResumeStep} from '../../../shared/models/tournaments/tournament-resume';
import {IThemeColors, ThemeService} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-tournament-summary-steps-list',
  templateUrl: './tournament-summary-steps-list.component.html',
  styles: ['']
})
export class TournamentSummaryStepsListComponent implements OnInit {
  @Input() steps: ITournamentResumeStep[];
  @Input() colors: IThemeColors;

  constructor() {
  }

  ngOnInit(): void {
  }
}
