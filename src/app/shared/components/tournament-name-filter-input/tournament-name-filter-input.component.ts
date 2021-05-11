import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-tournament-name-filter-input',
  templateUrl: './tournament-name-filter-input.component.html',
  styles: [
  ]
})
export class TournamentNameFilterInputComponent implements OnInit {

  @Input() name = '';
  @Output() ctrlReady = new EventEmitter<FormControl>();

  _nameCtrl: FormControl;

  constructor(private readonly _fb: FormBuilder) { }

  ngOnInit(): void {
    this._nameCtrl = this._fb.control(this.name)
    this.ctrlReady.emit(this._nameCtrl)
  }

}
