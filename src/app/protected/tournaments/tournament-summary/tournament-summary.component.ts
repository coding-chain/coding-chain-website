import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {LanguageService} from '../../../core/services/http/language.service';
import {Subscription} from 'rxjs';
import {ITournamentDetail} from '../../../shared/models/tournaments/tournaments-detail';
import {IThemeColors, Theme, ThemeService} from '../../../core/services/states/theme.service';
import {ITeamsLeaderBoards} from '../../../shared/models/teams/responses';
import {FileUtils} from '../../../shared/utils/file.utils';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITeamsLeaderBoardsFilter} from '../../../shared/models/teams/filters';


@Component({
  selector: 'app-tournament-summary',
  templateUrl: './tournament-summary.component.html',
  styles: []
})
export class TournamentSummaryComponent implements OnInit {

  tournament: ITournamentDetail;
  private _routeSub: Subscription;
  theme: Theme;
  colors: IThemeColors;
  picture: string;
  teamsCursor: PageCursor<ITeamsLeaderBoards, ITeamsLeaderBoardsFilter>;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tournamentService: TournamentService,
    private readonly _languageService: LanguageService,
    public readonly _themeService: ThemeService) {
    this._themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
      this.colors = this._themeService.colors;
    });
    this._themeService.publishTheme();
  }

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe(params => {
      this.setTournament(params.id);
    });
  }

  private setTournament(id: string): void {
    this._tournamentService.getOneTournamentDetail(id).subscribe(tournament => {
      this.tournament = tournament;
      FileUtils.fileToString(this.tournament.image).subscribe(picture => this.picture = picture);
    });
    this.teamsCursor = this._tournamentService.getTeamsLeaderBoardsCursor(id);
  }
}
