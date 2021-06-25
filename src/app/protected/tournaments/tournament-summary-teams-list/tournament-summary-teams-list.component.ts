import {AfterViewInit, Component, OnInit, ChangeDetectorRef, Input} from '@angular/core';
import {ITeamsLeaderBoards} from '../../../shared/models/teams/responses';
import {TeamService} from '../../../core/services/http/team.service';
import {IThemeColors} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-tournament-summary-teams-list',
  templateUrl: './tournament-summary-teams-list.component.html',
  styleUrls: ['./tournament-summary-teams-list.component.scss']
})
export class TournamentSummaryTeamsListComponent implements OnInit, AfterViewInit {

  @Input() colors: IThemeColors;
  @Input() teams: ITeamsLeaderBoards[];
  detailsCardHeight: number;

  constructor(private cdr: ChangeDetectorRef, private readonly _teamService: TeamService) {
  }

  ngOnInit(): void {
    this.detailsCardHeight = document.getElementById('detailsCard').offsetHeight;
    this.cdr.detectChanges();
  }

   ngAfterViewInit(): void {
     this.detailsCardHeight = document.getElementById('detailsCard').offsetHeight;
     this.cdr.detectChanges();
   }
}
