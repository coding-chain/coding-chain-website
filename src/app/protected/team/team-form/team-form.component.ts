import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../../core/services/http/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent extends FilterComponentBase<PublicUser, IUsersFilter> implements OnInit, OnChanges {

  @Input() teamId;
  @Input()
  team: ITeamNavigation;
  teamForm: FormGroup;
  teamNameControl: FormControl;
  searchControl: FormControl;

  // todo use snackbar for ok or ko messages
  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private teamService: TeamService) {
  }



  initForm(): void {
    this.teamNameControl = this.formBuilder.control(this.team?.name,
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


  ngOnChanges(changes: SimpleChanges): void {
    this.teamNameControl?.setValue(this.team.name);
  }

  searchTeammate(): void {
    this.filterChanged.emit({
      filterObj: {
        name: this.searchControl.value
      },
    });
  }

  saveTeamName(input: string): void {
    if (this.team !== null && this.team !== undefined) {
      this.teamService.renameTeam(this.team.id, {name: input}).subscribe(team => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Team Modifiée'
          }).then(res => {
            this.team = team;
          });
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Impossible de modifier la team'
          });
        });
    } else {
      this.teamService.createOne({name: input}).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Team créée '
          }).then(res => {
            this.router.navigate(['/team', response.id]);
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

  reset(): void {
  }
}
