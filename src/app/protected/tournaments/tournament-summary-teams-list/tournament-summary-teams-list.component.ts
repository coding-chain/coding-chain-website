import {AfterViewInit, Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import {ITeamsLeaderBoards} from '../../../shared/models/teams/responses';
import {TeamService} from '../../../core/services/http/team.service';
import {IThemeColors} from '../../../core/services/states/theme.service';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {SortOrder} from '../../../shared/types/sort-order';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tournament-summary-teams-list',
  templateUrl: './tournament-summary-teams-list.component.html',
  styleUrls: ['./tournament-summary-teams-list.component.scss']
})
export class TournamentSummaryTeamsListComponent implements OnInit, AfterViewInit {

  @Input() colors: IThemeColors;
  @Input() teams: ITeamsLeaderBoards[];
  private _routeSub: Subscription;
  private tournamentId: string;
  private order: SortOrder = 'desc';
  private hasFinishFilter: boolean = null;

  detailsCardHeight: number;

  constructor(private cdr: ChangeDetectorRef, private readonly _teamService: TeamService, private readonly _tournamentService: TournamentService, private readonly _route: ActivatedRoute) {
    this._routeSub = this._route.params.subscribe(params => {
      this.tournamentId = params.id;
    });
  }

  ngOnInit(): void {
    this.detailsCardHeight = document.getElementById('detailsCard').offsetHeight;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.detailsCardHeight = document.getElementById('detailsCard').offsetHeight;
    this.cdr.detectChanges();
  }

  switchOrder(): void {
    if (this.order === 'asc') {
      this.order = 'desc';
    } else {
      this.order = 'asc';
    }
  }

  switchHasFinishFilter(): void {
    if (this.hasFinishFilter) {
      this.hasFinishFilter = null;
    } else {
      this.hasFinishFilter = true;
    }
  }

  sortByScore(): void {
    this.switchOrder();
    this._tournamentService.getTeamsLeaderBoards(this.tournamentId, {ascOrderColumns: [this.order === 'asc' ? 'score' : undefined]}).subscribe(teams => {
      this.teams = teams;
    });
  }

  sortByHasFinished(): void {
    this.switchHasFinishFilter();
    this._tournamentService.getTeamsLeaderBoards(this.tournamentId, {filterObj: {hasFinished: this.hasFinishFilter}}).subscribe(teams => {
      this.teams = teams;
    });
  }
}
