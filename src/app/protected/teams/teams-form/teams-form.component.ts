import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ITeamNavigation, ITeamResume} from '../../../shared/models/teams/responses';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {PublicUser} from '../../../shared/models/users/responses';
import {GetParams} from '../../../shared/models/http/get.params';

@Component({
  selector: 'app-teams-form',
  templateUrl: './teams-form.component.html',
})
export class TeamsFormComponent implements OnInit, OnChanges {
  @Input() team: ITeamNavigation;
  @Input() teamForm: FormGroup;
  teamNameControl: FormControl;
  @Output() searchMember = new EventEmitter<GetParams<PublicUser, IUsersFilter>>();
  @Output() deleteTeam = new EventEmitter();
  @Output() saveTeam = new EventEmitter();
  @Input() nameMinLength = 3;
  @Input() nameMaxLength = 20;

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.teamNameControl?.setValue(this.team?.name);
  }

  ngOnInit(): void {
    this.teamNameControl = this._fb.control(this.team?.name,
      [Validators.required, Validators.minLength(this.nameMinLength), Validators.maxLength(this.nameMaxLength)]);
    this.teamForm.setControl('name', this.teamNameControl);
    this.teamForm.valueChanges.subscribe((form: ITeamResume) => {
      this.team.name = form.name;
    });
  }

  searchTeammate($filter: GetParams<PublicUser, IUsersFilter>): void {
    this.searchMember.emit($filter);
  }

  save(): void {
    this.saveTeam.emit();
  }

  delete(): void {
    this.deleteTeam.emit();
  }
}
