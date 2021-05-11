import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  // styleUrls: ['team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;

  teamNameControl: FormControl;
  searchControl: FormControl;

  nameSuggestions: string[] = ['Toto', 'Tata', 'John Doe'];
  filteredNameSuggestions: Observable<string[]>;

  constructor(private formBuilder: FormBuilder) {
  }

  initForm(): void {
    this.teamNameControl = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
    this.searchControl = this.formBuilder.control('', [Validators.required]);
    this.teamForm = this.formBuilder.group({
        teamName: this.teamNameControl,
        searchName: this.searchControl
      }
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.filteredNameSuggestions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.nameSuggestions.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmitTeam(): void {
  }
}
