import {Component, OnInit} from '@angular/core';
import {UserStateService} from '../../../core/services/user-state.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tournaments-root',
  templateUrl: './tournaments-root.component.html',
  styles: []
})
export class TournamentsRootComponent implements OnInit {

  canCreateTournament$ = new Observable<boolean>();

  constructor(private userStateService: UserStateService) {

  }

  ngOnInit(): void {
    this.canCreateTournament$ = this.userStateService.userSubject$.pipe(map(user => {
      if (!user) {
        return;
      }
      return user.isAdmin() || user.isCreator();
    }));
    this.userStateService.loadUser();
  }

}
