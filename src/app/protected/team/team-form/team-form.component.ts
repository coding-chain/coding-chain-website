import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../../core/services/http/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnInit {
  @Input() teamId;
  teamForm: FormGroup;
  teamNameControl: FormControl;
  searchControl: FormControl;

  // todo use snackbar for ok or ko messages

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private teamService: TeamService) {
  }

  initForm(): void {
    this.teamNameControl = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
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
    if (this.teamId !== null) {
      this.teamService.renameTeam(this.teamId, {name: input}).subscribe(team => {
        // todo success or failure
      });
    } else {
      this.teamService.createOne({name: input}).subscribe(team => {
          console.log(team);
          // todo redirect to same url with id into it
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Team créée '
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
