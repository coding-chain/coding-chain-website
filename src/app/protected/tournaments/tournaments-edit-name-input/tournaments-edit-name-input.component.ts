import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-name-input',
  templateUrl: './tournaments-edit-name-input.component.html',
  styles: []
})
export class TournamentsEditNameInputComponent implements OnInit {

  @Input() nameCtrl;
  @Input() maxNameLength = 50;
  @Input() minNameLength = 5;

  constructor(private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.nameCtrl.setValidators([Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]);
  }

}
