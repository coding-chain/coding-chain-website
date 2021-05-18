import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PublicUser} from '../../../shared/models/users/responses';
import {TeamService} from '../../../core/services/http/team.service';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {UserService} from '../../../core/services/http/user.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styles: []
})
export class TeamPageComponent implements OnInit {
  isSearching = true; // todo set default to false after tests
  searchedTeammates: PublicUser[] = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: []}]; // todo remove after tests
  yourTeammates: PublicUser[] = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: ['1']}]; // todo remove after tests
  teamId: string;
  team: ITeamNavigation;

  constructor(private route: ActivatedRoute, private teamService: TeamService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.teamId = res.id;
      this.fetchTeam();
    });
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
