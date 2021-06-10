import {Component, Input, OnInit} from '@angular/core';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-tournament-summary-step',
  templateUrl: './tournament-summary-step.component.html',
  styles: []
})
export class TournamentSummaryStepComponent implements OnInit {
  @Input() step: IStepNavigation;
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
