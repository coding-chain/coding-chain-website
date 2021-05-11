import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styles: []
})
export class TeamPageComponent implements OnInit {
  teamName = '';

  constructor( private router: Router) {
    // todo call service
  }

  ngOnInit(): void {
  }
}
