import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IPublicUser} from '../../../shared/models/users/responses';
import {TeamService} from '../../../core/services/http/team.service';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {UserService} from '../../../core/services/http/user.service';
import {GetParams} from '../../../shared/models/http/get.params';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styles: []
})
export class TeamsPageComponent implements OnInit {
  isSearching = true; // todo set default to false after tests
  searchedTeammates: IPublicUser[];
  yourTeammates: IPublicUser[]; // = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: ['1']}]; // todo remove after tests
  teamId: string;
  team: ITeamNavigation;
  userCursor: PageCursor<IPublicUser, IUsersFilter>;
  users$ = new BehaviorSubject<IPublicUser[]>([]);

  constructor(private route: ActivatedRoute, private teamService: TeamService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.teamId = res.id;
      this.fetchTeam();
    });

    this.userCursor = this.userService.getPublicUsersCursor();
    this.userCursor.resultsSubject$.subscribe(users => {
      console.log('subscribe', users);
      this.users$.next(users);
    });
    this.userCursor.current();

  }

  fetchTeam(): void {
    if (this.teamId != null) {
      this.teamService.getOneById(this.teamId).subscribe(team => {
        this.team = team;
        // this.fetchTeammates(team);
      });
    }
  }

  fetchTeammates(team): void {
    team.membersIds.forEach(memberId => {
      this.teamService.getMemberById(this.team.id, memberId).subscribe(member => {
        this.userService.getOneById(member.userId).subscribe(user => {
          // todo fill array
          console.log(user);
        });
      });

    });
  }

  searchUser($filter: GetParams<IPublicUser, IUsersFilter>): void {
    this.userCursor.updateFilter($filter);
    this.userCursor.current();
  }

  addTeammate(id: string): void {
    // todo
  }

  manageStatus(id: string): void {
    // todo
  }

  removeTeammate(id: string): void {
    // todo
  }
}
