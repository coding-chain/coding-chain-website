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
  }

  @Input() name:string;

  ngOnInit(): void {
    this.nameCtrl = this.fb.control(this.name, [Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);

    this.nameCtrlReady.emit(this.nameCtrl);
  }

}
