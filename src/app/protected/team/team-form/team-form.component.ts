import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TeamService} from '../../../core/services/http/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnInit {
  @Input() set team(team) {
    if (team) {
      this.teamNameControl.setValue(team.name);
    }
  }

  teamForm: FormGroup;
  teamNameControl: FormControl;
  searchControl: FormControl;

  // todo use snackbar for ok or ko messages

  constructor(private route: ActivatedRoute, private router: Router,
              private formBuilder: FormBuilder, private teamService: TeamService) {
  }

  initForm(): void {
    this.teamNameControl = this.formBuilder.control('',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
    this.searchControl = this.formBuilder.control('');
    this.teamForm = this.formBuilder.group({
        teamName: this.teamNameControl,
        searchName: this.searchControl
      }
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  searchTeammate(input: string): void {
    // todo fetch corresponding users and put it in searchedTeammates
  }

  saveTeamName(input: string): void {
    if (this.team !== null) {
      this.teamService.renameTeam(this.team.id, {name: input}).subscribe(team => {
        // todo success or failure
      });
    } else {
      this.teamService.createOne({name: input}).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Team créée '
          }).then(res => {
            this.router.navigate(['/team', {teamId: response.id}]);
          });
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Impossible de créer la team'
          });
        }
      );

    }

  }
}
