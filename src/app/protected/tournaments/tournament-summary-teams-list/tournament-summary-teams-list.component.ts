import {AfterViewInit, Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import {ITeamsLeaderBoards} from '../../../shared/models/teams/responses';
import {TeamService} from '../../../core/services/http/team.service';
import {IThemeColors} from '../../../core/services/states/theme.service';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {SortOrder} from '../../../shared/types/sort-order';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITeamsLeaderBoardsFilter} from '../../../shared/models/teams/filters';
import {GetParams} from '../../../shared/models/http/get.params';
import {filter} from 'rxjs/operators';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-tournament-summary-teams-list',
  templateUrl: './tournament-summary-teams-list.component.html',
  styleUrls: ['./tournament-summary-teams-list.component.scss']
})
export class TournamentSummaryTeamsListComponent implements OnInit, AfterViewInit {

  @Input() colors: IThemeColors;
  @Input() teamsCursor: PageCursor<ITeamsLeaderBoards, ITeamsLeaderBoardsFilter>;
  filter: GetParams<ITeamsLeaderBoards, ITeamsLeaderBoardsFilter> = {descOrderColumns: ['score'], filterObj: {hasFinished: null}};
  teams: ITeamsLeaderBoards[] = [];
  hasFinishedCtrl: FormControl;

  get hasFinishedFilterLabel(): string {
    if (this.hasFinishedCtrl.value) {
      return 'Terminé';
    }
    if (this.hasFinishedCtrl.value === false) {
      return 'En cours';
    }
    return 'Tout';
  }

  constructor(private fb: FormBuilder, private readonly _teamService: TeamService, private readonly _tournamentService: TournamentService) {

  }

  ngOnInit(): void {
    this.hasFinishedCtrl = this.fb.control(null);
    this.teamsCursor.resultsSubject$.subscribe(teams => this.teams = teams);
    this.teamsCursor.current();
    this.hasFinishedCtrl.valueChanges.subscribe(hasFinished => {
      this.filter.filterObj.hasFinished = hasFinished;
      this.teamsCursor.updateFilter(this.filter).current();
    });
  }

  ngAfterViewInit(): void {
  }

  switchOrder(): void {
    if (this.filter.descOrderColumns?.some(col => col === 'score')) {
      this.filter.descOrderColumns = null;
      this.filter.ascOrderColumns = ['score'];
    } else {
      this.filter.ascOrderColumns = null;
      this.filter.descOrderColumns = ['score'];
    }
  }

  sortByScore(): void {
    this.switchOrder();
    this.teamsCursor.updateFilter(this.filter).current();
  }


}
