import {Component, Input, OnInit} from '@angular/core';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import {ITournamentResumeStep} from '../../../shared/models/tournaments/tournament-resume';

@Component({
  selector: 'app-tournament-summary-step',
  templateUrl: './tournament-summary-step.component.html',
  styles: []
})
export class TournamentSummaryStepComponent implements OnInit {
  @Input() step: ITournamentResumeStep;
  theme: Theme;

  constructor(private readonly _themeService: ThemeService) {
  }

  ngOnInit(): void {
    this._themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
    });
    this._themeService.publishTheme();
  }

}
