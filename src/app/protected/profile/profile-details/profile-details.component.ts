import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {TeamService} from '../../../core/services/http/team.service';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITournamentNavigation} from '../../../shared/models/tournaments/responses';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {ITeamNavigation} from '../../../shared/models/teams/responses';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styles: []
})
export class ProfileDetailsComponent implements OnInit {
  user$: Subject<ConnectedUser>;
  teams: ITeamNavigation[] = [];
  tournaments: ITournamentNavigation[] = [];
  private tournamentCursor: PageCursor<ITournamentNavigation, ITournamentsFilter>;

  constructor(private userStateService: UserStateService, private teamsService: TeamService,
              private tournamentService: TournamentService) {
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;

    this.user$.subscribe(user => {

      this.tournamentCursor = this.tournamentService.getTournamentNavigationCursor({filterObj: {participantId: user.id}});
      this.tournamentCursor.resultsSubject$.subscribe(tournament => this.tournaments = tournament);
      this.tournamentCursor.current();
      user.teams.forEach(team => {
        this.teamsService.getOneById(team.teamId).subscribe(t => {
          this.teams.push(t);
        });
      });

    });
  }
}
