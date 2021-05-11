import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Form, FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-tournaments-edit-name-input',
  templateUrl: './tournaments-edit-name-input.component.html',
  styles: []
})
export class TournamentsEditNameInputComponent implements OnInit {

  @Output() nameCtrlReady = new EventEmitter<FormControl>();
  nameCtrl: FormControl
  readonly maxNameLength = 50
  readonly minNameLength = 5

  constructor(private fb: FormBuilder) {
    this.nameCtrl = fb.control('', [Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)])
  }

  ngOnInit(): void {
    this.nameCtrlReady.emit(this.nameCtrl);
  }

}
