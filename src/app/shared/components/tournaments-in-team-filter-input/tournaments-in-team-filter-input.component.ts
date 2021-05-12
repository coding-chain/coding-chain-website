import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-tournaments-in-team-filter-input',
  templateUrl: './tournaments-in-team-filter-input.component.html',
  styles: []
})
export class TournamentsInTeamFilterInputComponent implements OnInit {

  _inMyTeamCtrl: FormControl;
  @Output() inMyTeamCtrlReady = new EventEmitter<FormControl>();

  constructor(fb: FormBuilder) {
    this._inMyTeamCtrl = fb.control(null);
  }

  @Input() set inMyTeam(val: boolean) {
    this._inMyTeamCtrl.setValue(val);
  }

  ngOnInit(): void {
    this.inMyTeamCtrlReady.emit(this._inMyTeamCtrl);
  }
}
