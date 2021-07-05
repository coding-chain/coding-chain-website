import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FileUtils} from '../../../shared/utils/file.utils';
import {MatDialog} from '@angular/material/dialog';
import {TournamentsItemComponent} from '../../../protected/tournaments/tournaments-item/tournaments-item.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-tournament-item',
  templateUrl: './home-tournament-item.component.html',
  styleUrls: ['home-tournament-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeTournamentItemComponent extends TournamentsItemComponent implements OnInit {


  picture: string;

  constructor(dialog: MatDialog, router: Router) {
    super(dialog, router);
  }

  ngOnInit(): void {
    FileUtils.fileToString(this.tournament.image).subscribe(picture => this.picture = picture);
    super.ngOnInit();
  }


}
