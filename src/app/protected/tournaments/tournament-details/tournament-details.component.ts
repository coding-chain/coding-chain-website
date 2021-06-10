import {Component, Input, OnInit} from '@angular/core';
import {ITournamentDetail} from '../../../shared/models/tournaments/tournaments-detail';
import {DateUtils} from '../../../shared/utils/date.utils';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';


@Component({
  selector: 'app-tournament-details',
  templateUrl: './tournament-details.component.html',
  styles: []
})
export class TournamentDetailsComponent implements OnInit {

  @Input() tournament: ITournamentDetail;
  startDateTournament: string;
  endDateTournament: string;
  theme: Theme;
  tournamentLanguages: IProgrammingLanguage[];
  progressCursor: number;

  constructor(private readonly _themeService: ThemeService) {
  }

  ngOnInit(): void {
    this._themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
    });
    this._themeService.publishTheme();

    this.tournamentLanguages = this.tournament.steps.map(s => s.language);
    this.startDateTournament = DateUtils.dateToString(this.tournament.startDate);
    this.endDateTournament = DateUtils.dateToString(this.tournament.endDate);
    this.test();
    this.progressCursor = this.progressTournamentDate(this.tournament.startDate, this.tournament.endDate);
  }

  public progressTournamentDate(start: Date, end: Date): number {
    return (new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100;
  }

  private test(): void {
    // console.log('temps restant', this.tournament.endDate.getTime() - this.tournament.startDate.getTime() );
  }
}
