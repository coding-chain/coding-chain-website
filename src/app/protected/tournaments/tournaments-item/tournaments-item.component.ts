import {Component, Input, OnInit} from '@angular/core';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';

@Component({
  selector: 'app-tournaments-item',
  templateUrl: './tournaments-item.component.html',
  styles: []
})
export class TournamentsItemComponent implements OnInit {

  @Input() currentUser: ConnectedUser;
  @Input() tournament: ITournamentResume;


  constructor() {
  }

  ngOnInit(): void {
  }

}
