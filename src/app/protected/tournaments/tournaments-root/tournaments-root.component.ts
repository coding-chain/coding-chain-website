import { Component, OnInit } from '@angular/core';
import {UserStateService} from "../../../core/services/user-state.service";
import {BehaviorSubject, Observable} from "rxjs";
import {PublicUser} from "../../../shared/models/users/responses";
import {ConnectedUser} from "../../../shared/models/users/connected-user";

@Component({
  selector: 'app-tournaments-root',
  templateUrl: './tournaments-root.component.html',
  styles: [
  ]
})
export class TournamentsRootComponent implements OnInit {

  canCreateTournament$ = new BehaviorSubject<boolean> (false)
  constructor(private userStateService: UserStateService) {
    this.userStateService.userSubject$.subscribe(user => {
      if(!user) return;
      this.canCreateTournament$.next(user.isAdmin() || user.isCreator())
    })
  }

  ngOnInit(): void {
  }

}
