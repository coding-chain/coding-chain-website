import {Component, OnInit} from '@angular/core';
import {UserStateService} from '../../../core/services/user-state.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-tournaments-root',
  templateUrl: './tournaments-root.component.html',
  styles: []
})
export class TournamentsRootComponent implements OnInit {

  canCreateTournament$ = new BehaviorSubject<boolean>(false);

  constructor(private userStateService: UserStateService) {

  }

  ngOnInit(): void {
    this.userStateService.userSubject$.subscribe(user => {
      if (!user) {
        return;
      }
      this.canCreateTournament$.next(user.isAdmin() || user.isCreator());
    });
  }

}
