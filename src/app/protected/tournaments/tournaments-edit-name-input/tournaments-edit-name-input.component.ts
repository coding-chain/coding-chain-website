import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-name-input',
  templateUrl: './tournaments-edit-name-input.component.html',
  styles: []
})
export class TournamentsEditNameInputComponent implements OnInit {

  @Output() nameCtrlReady = new EventEmitter<FormControl>();
  nameCtrl: FormControl;
  @Input() maxNameLength = 50;
  @Input() minNameLength = 5;

  constructor(private fb: FormBuilder) {
    this.nameCtrl = fb.control('', [Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);
  }

  @Input() set name(name: string) {
    this.nameCtrl.setValue(name);
  }

  ngOnInit(): void {
    this.nameCtrlReady.emit(this.nameCtrl);
  }

}
