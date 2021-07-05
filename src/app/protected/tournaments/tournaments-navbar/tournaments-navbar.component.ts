import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tournaments-navbar',
  templateUrl: './tournaments-navbar.component.html',
  styles: []
})
export class TournamentsNavbarComponent implements OnInit {

  @Input() canCreateTournament: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
