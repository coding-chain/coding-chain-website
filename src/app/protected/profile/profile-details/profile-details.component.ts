import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {TeamService} from '../../../core/services/http/team.service';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITournamentNavigation} from '../../../shared/models/tournaments/responses';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {ITeamNavigation, ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {ITeamFilter} from '../../../shared/models/teams/filters';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styles: []
})
export class ProfileDetailsComponent implements OnInit {
  connectedUser: ConnectedUser;
  connectedUser$: Subject<ConnectedUser>;
  teams: ITeamWithMembersResume[] = [];
  tournaments: ITournamentResume[] = [];
  tournamentCursor: PageCursor<ITournamentResume, ITournamentsFilter>;
  teamCursor: PageCursor<ITeamWithMembersResume, ITeamFilter>;

  constructor(private userStateService: UserStateService, private teamService: TeamService,
              private tournamentService: TournamentService) {
  }

  ngOnInit(): void {
    this.connectedUser$ = this.userStateService.userSubject$;

    this.connectedUser$.subscribe(user => {
      this.tournamentCursor = this.tournamentService.getTournamentResumeCursor({filterObj: {participantId: user.id}});
      this.tournamentCursor.resultsSubject$.subscribe(tournament => this.tournaments = tournament);
      this.tournamentCursor.current();

      this.teamCursor = this.teamService.getResumeCursor({filterObj: {memberId: user.id}});
      this.teamCursor.resultsSubject$.subscribe(team => {
        this.teams = team;
      });
      this.teamCursor.current();

      this.connectedUser = user;
    });
  }

  leaveTeam(team: ITeamWithMembersResume): void {
    this.teamService.removeTeamMember(team.id, this.connectedUser.id).subscribe(res => {
      this.userStateService.reloadUser$().subscribe(user => this.teamCursor.current());
      Swal.fire(SwalUtils.successOptions('Vous avez quitté l\'équipe'));
    }, error => Swal.fire(SwalUtils.errorOptions('Vous n\'avez pas pu quitter l\'équipe')));
  }
}
