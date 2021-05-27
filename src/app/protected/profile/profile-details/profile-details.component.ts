import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/user-state.service';
import {ITeamResume} from '../../../shared/models/teams/responses';
import {TeamService} from '../../../core/services/http/team.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styles: []
})
export class ProfileDetailsComponent implements OnInit {
  user$: Subject<ConnectedUser>;
  teams = [];

  constructor(private userStateService: UserStateService, private teamsService: TeamService) {
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;
    this.user$.subscribe(user => {
      user.teams.forEach(team => {
        this.teamsService.getOneById(team.teamId).subscribe(t => {
          console.log(t);
          this.teams.push(t);
        });
      });
    });
  }

}
