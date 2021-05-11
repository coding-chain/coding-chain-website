import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PublicUser} from '../../../shared/models/users/responses';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styles: []
})
export class TeamPageComponent implements OnInit {
  isSearching = true; // todo set default to false after tests
  searchedTeammates: PublicUser[] = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: []}]; // todo remove after tests
  yourTeammates: PublicUser[] = [{username: 'fghjk', email: 'fghjknb', id: 'hj', teamIds: [], rightIds: []}]; // todo remove after tests

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.fetchYourTeammates();
  }

  fetchYourTeammates(): void {
    // todo  fetch  users in this team and put it in yourTeammates
  }

  addTeammate(id: string): void {
    // todo
  }

  removeTeammate(id: string): void {
    // todo
  }
}
