import {Component, OnInit} from '@angular/core';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {BehaviorSubject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {LanguageService} from '../../../core/services/http/language.service';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {GetParams} from '../../../shared/models/http/get.params';
import {ITeamFilter} from '../../../shared/models/teams/filters';
import {ITeamNavigation, ITeamWithMembersResume} from '../../../shared/models/teams/responses';
import {TeamService} from '../../../core/services/http/team.service';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import {ArrayUtils} from '../../../shared/utils/array.utils';

@Component({
  selector: 'app-teams-list',
  templateUrl: './teams-list.component.html',
  styles: []
})
export class TeamsListComponent implements OnInit {
  teamCursor: PageCursor<ITeamWithMembersResume, ITeamFilter>;
  teams$ = new BehaviorSubject<ITeamWithMembersResume[]>([]);
  connectedUser: ConnectedUser;
  connectedUser$ = new BehaviorSubject<ConnectedUser>(null);
  trackBy = ArrayUtils.trackById;

  constructor(private readonly _teamService: TeamService,
              private readonly _languageService: LanguageService,
              private readonly _userStateService: UserStateService) {
  }

  ngOnInit(): void {
    this.teamCursor = this._teamService.getResumeCursor();
    this.teamCursor.resultsSubject$.subscribe(teams => {
      this.teams$.next(teams);
    });
    this._userStateService.userSubject$.subscribe(user => {
      this.connectedUser = user;
      this.connectedUser$.next(user);
    });
    this._userStateService.loadUser();
    this.teamCursor.current();
  }

  searchTeams($filter: GetParams<ITeamNavigation, ITeamFilter>): void {
    this.teamCursor.updateFilter($filter).current();
  }

  leaveTeam(team: ITeamWithMembersResume): void {
    this._teamService.removeTeamMember(team.id, this.connectedUser.id).subscribe(res => {
      this._userStateService.reloadUser$().subscribe(user => this.teamCursor.current());
      Swal.fire(SwalUtils.successOptions('Vous avez quitté l\'équipe'));
    }, error => Swal.fire(SwalUtils.errorOptions('Vous n\'avez pas pu quitter l\'équipe')));
  }
}
