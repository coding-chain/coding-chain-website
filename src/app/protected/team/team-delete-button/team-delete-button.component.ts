import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TeamDeleteDialogComponent} from '../team-delete-dialog/team-delete-dialog.component';
import {TeamService} from '../../../core/services/http/team.service';
import Swal from "sweetalert2";
import {Router} from '@angular/router';


@Component({
  selector: 'app-team-delete-button',
  templateUrl: './team-delete-button.component.html',
})
export class TeamDeleteButtonComponent implements OnInit {

  @Input()
  teamId;

  constructor(public dialog: MatDialog, private teamService: TeamService, private router: Router) {
  }

  ngOnInit(): void {
  }

  openDeleteTeamDialog(): void {
    const dialogRef = this.dialog.open(TeamDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteTeam();
      }
    });
  }

  deleteTeam(): void {
    this.teamService.deleteTeam(this.teamId).subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'L\'équipe à bien été supprimée'
        }).then(res => {
          this.router.navigateByUrl('/home');
        });
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Une erreur est survenue'
        });
      }
    );
  }
}

