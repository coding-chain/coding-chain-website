import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-tournaments-in-team-filter-input',
  templateUrl: './tournaments-in-team-filter-input.component.html',
  styles: [
  ]
})
export class TournamentsInTeamFilterInputComponent implements OnInit {

  constructor(private  readonly _fb:FormBuilder) {
  }
  _inMyTeamCtrl: FormControl;

  @Input() set inMyTeam(val: boolean){
    this._inMyTeamCtrl.setValue(val);
  }
  @Output() inMyTeamCtrlReady = new EventEmitter<FormControl>();

  ngOnInit(): void {
    this._inMyTeamCtrl = this._fb.control(null);
    this.inMyTeamCtrlReady.emit(this._inMyTeamCtrl);
  }
}