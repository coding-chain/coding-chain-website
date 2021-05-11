import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;
  teamNameControl: FormControl;
  searchControl: FormControl;

  // todo use snackbar for ok or ko messages

  constructor(private formBuilder: FormBuilder) {
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
    // todo save team name
  }

}
