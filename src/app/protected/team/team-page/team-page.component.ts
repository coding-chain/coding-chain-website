import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PublicUser} from '../../../shared/models/users/responses';
import {TeamService} from '../../../core/services/http/team.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styles: []
})
export class TeamPageComponent implements OnInit {
  isSearching = true; // todo set default to false after tests
  searchedTeammates: PublicUser[] = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: []}]; // todo remove after tests
  yourTeammates: PublicUser[] = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: ['1']}]; // todo remove after tests
  teamId;
  team;

  constructor(private route: ActivatedRoute, private teamService: TeamService) {
    this.teamId = this.route.snapshot.paramMap.get('teamId');
  }

  ngOnInit(): void {
    this.fetchTeam();
  }

  fetchTeam(): void {
    if (this.teamId != null) {
      this.teamService.getOneById(this.teamId).subscribe(team => {
        this.team = team;
        console.log(this.team);
        // this.fetchTeammates(team);
      });
    }
  }

  fetchTeammates(team): void {
    team.membersIds.forEach(memberId => {
      this.teamService.getMemberById(team.id, memberId).subscribe(member => {
        // todo how to do member fetching
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
