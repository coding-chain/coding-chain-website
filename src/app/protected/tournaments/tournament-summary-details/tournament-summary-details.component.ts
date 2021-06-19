import {Component, Input, OnInit} from '@angular/core';
import {ITournamentDetail} from '../../../shared/models/tournaments/tournaments-detail';
import {DateUtils} from '../../../shared/utils/date.utils';
import {IThemeColors, Theme, ThemeService} from '../../../core/services/states/theme.service';
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
  startDateTournament: string;
  endDateTournament: string;
  tournamentLanguages: IProgrammingLanguage[];
  progressCursor: number;
  remainingDays: number;

  constructor(private readonly _themeService: ThemeService) {
  }

  ngOnInit(): void {


    this.tournamentLanguages = this.tournament.steps.map(s => s.language);
    this.startDateTournament = DateUtils.dateToString(this.tournament.startDate);
    this.endDateTournament = DateUtils.dateToString(this.tournament.endDate);
    this.remainingDays = this.calculateRemainingDays();
    this.progressCursor = this.progressTournamentDate(this.tournament.startDate, this.tournament.endDate);
  }

  public progressTournamentDate(start: Date, end: Date): number {
    return (new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100;
  }

  private calculateRemainingDays(): number {
    return Math.round((this.tournament.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  }
}
