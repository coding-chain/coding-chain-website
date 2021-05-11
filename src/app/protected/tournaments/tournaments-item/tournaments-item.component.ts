import {Component, Input, OnInit} from '@angular/core';
import {ConnectedUser} from "../../../shared/models/users/connected-user";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {TournamentResume} from "../../../shared/models/tournaments/tournament-resume";

@Component({
  selector: 'app-tournaments-item',
  templateUrl: './tournaments-item.component.html',
  styles: [
  ]
})
export class TournamentsItemComponent implements OnInit {

  @Input() currentUser: ConnectedUser;
  @Input() tournament: TournamentResume;


  constructor() { }

  ngOnInit(): void {
  }

}
