import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {TeamService} from '../../../core/services/http/team.service';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITournamentNavigation} from '../../../shared/models/tournaments/responses';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {ITeamNavigation, ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {ITeamFilter} from '../../../shared/models/teams/filters';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styles: []
})
export class ProfileDetailsComponent implements OnInit {
  user$: Subject<ConnectedUser>;
  teams: ITeamNavigation[] = [];
  tournaments: ITournamentNavigation[] = [];
  tournamentCursor: PageCursor<ITournamentNavigation, ITournamentsFilter>;
  teamCursor: PageCursor<ITeamWithMembersResume, ITeamFilter>;

  constructor(private userStateService: UserStateService, private teamService: TeamService,
              private tournamentService: TournamentService) {
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;

    this.user$.subscribe(user => {
      this.tournamentCursor = this.tournamentService.getTournamentNavigationCursor({filterObj: {participantId: user.id}});
      this.tournamentCursor.resultsSubject$.subscribe(tournament => this.tournaments = tournament);
      this.tournamentCursor.current();

      this.teamCursor = this.teamService.getResumeCursor({filterObj: {memberId: user.id}});
      this.teamCursor.resultsSubject$.subscribe(team => {
        this.teams = team;
      });
      this.teamCursor.current();
    });
  }
}
