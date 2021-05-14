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

  constructor(private route: ActivatedRoute, private teamService: TeamService) {
    this.teamId = this.route.snapshot.paramMap.get('id');
    if (this.teamId != null) {
      this.teamService.getOneById(this.teamId).subscribe(team => {
        // todo fill infos
      });
    }

  }

  ngOnInit(): void {
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
