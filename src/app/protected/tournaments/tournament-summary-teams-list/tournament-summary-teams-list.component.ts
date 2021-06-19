import {AfterViewInit, Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import {ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITeamFilter} from '../../../shared/models/teams/filters';
import {TeamService} from '../../../core/services/http/team.service';
import {IThemeColors} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-tournament-summary-teams-list',
  templateUrl: './tournament-summary-teams-list.component.html',
  styleUrls: ['./tournament-summary-teams-list.component.scss']
})
export class TournamentSummaryTeamsListComponent implements OnInit, AfterViewInit {

  @Input() colors: IThemeColors;
  detailsCardHeight: number;
  teams: ITeamWithMembersResume[] = [];
  teamCursor: PageCursor<ITeamWithMembersResume, ITeamFilter>;

  constructor(private cdr: ChangeDetectorRef, private readonly _teamService: TeamService) {
  }

  ngOnInit(): void {
    this.detailsCardHeight = document.getElementById('detailsCard').offsetHeight;
    this.cdr.detectChanges();

    this.teamCursor = this._teamService.getResumeCursor();
    this.teamCursor.resultsSubject$.subscribe(team => {
      this.teams = team;
    });
    this.teamCursor.current();
  }

   ngAfterViewInit(): void {
     this.detailsCardHeight = document.getElementById('detailsCard').offsetHeight;
     this.cdr.detectChanges();
   }
}
