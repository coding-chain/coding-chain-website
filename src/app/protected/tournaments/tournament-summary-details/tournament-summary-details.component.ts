import {Component, Input, OnInit} from '@angular/core';
import {ITournamentDetail} from '../../../shared/models/tournaments/tournaments-detail';
import {DateUtils} from '../../../shared/utils/date.utils';
import {IThemeColors, Theme} from '../../../core/services/states/theme.service';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';


@Component({
  selector: 'app-tournament-summary-details',
  templateUrl: './tournament-summary-details.component.html',
  styles: []
})
export class TournamentSummaryDetailsComponent implements OnInit {

  @Input() tournament: ITournamentDetail;
  @Input() colors: IThemeColors;
  @Input() theme: Theme;
  startDateTournament?: string;
  endDateTournament?: string;
  tournamentLanguages: IProgrammingLanguage[];
  progressCursor = 0;
  remainingDays = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.tournamentLanguages = this.tournament.steps.map(s => s.language);
    this.startDateTournament = this.tournament.startDate ? DateUtils.dateToString(this.tournament.startDate) : null;
    this.endDateTournament = this.tournament.endDate ? DateUtils.dateToString(this.tournament.endDate) : null;
    if (this.tournament.startDate && this.tournament.endDate) {
      this.remainingDays = this.calculateRemainingDays();
      this.progressCursor = this.progressTournamentDate(this.tournament.startDate, this.tournament.endDate);
    }

  }

  public progressTournamentDate(start: Date, end: Date): number {
    return (new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100;
  }

  private calculateRemainingDays(): number {
    return Math.round((this.tournament.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  }
}
