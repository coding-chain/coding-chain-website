import {Component, Input, OnInit} from '@angular/core';
import {ITournamentEdition} from '../../../shared/models/tournaments/tournament-edition';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit {

  @Input() tournament: ITournamentEdition;
  formGroup: FormGroup;

  constructor(fb: FormBuilder) {
    this.formGroup = fb.group({});
  }

  private _descriptionCtrl: FormControl;

  set descriptionCtrl(ctrl: FormControl) {
    this._descriptionCtrl = ctrl;
    this.formGroup.setControl('description', this._descriptionCtrl);
  }

  private _nameCtrl: FormControl;

  set nameCtrl(ctrl: FormControl) {
    this._nameCtrl = ctrl;
    this.formGroup.setControl('name', this._nameCtrl);
  }

  ngOnInit(): void {
  }

}
