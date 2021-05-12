import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TournamentService} from '../../../core/services/http/tournament.service';
import {ITournamentEdition} from '../../../shared/models/tournaments/tournament-edition';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-form',
  templateUrl: './tournaments-edit-form.component.html',
  styles: []
})
export class TournamentsEditFormComponent implements OnInit {

  constructor(fb: FormBuilder) {
    this.formGroup = fb.group({});
  }
  @Input() tournament: ITournamentEdition;
  formGroup: FormGroup;
  private _descriptionCtrl: FormControl;
  private _nameCtrl: FormControl;

  set nameCtrl(ctrl: FormControl) {
    this._nameCtrl = ctrl;
    this.formGroup.setControl('name', this._nameCtrl);
  }
  set descriptionCtrl(ctrl: FormControl) {
    this._descriptionCtrl = ctrl;
    this.formGroup.setControl('description', this._descriptionCtrl);
  }
  ngOnInit(): void {
  }

}
