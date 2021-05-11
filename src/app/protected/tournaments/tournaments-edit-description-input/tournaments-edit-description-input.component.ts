import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-tournaments-edit-description-input',
  templateUrl: './tournaments-edit-description-input.component.html',
  styles: [
  ]
})
export class TournamentsEditDescriptionInputComponent implements OnInit {

  @Output() descriptionCtrlReady = new EventEmitter<FormControl>();
  descriptionCtrl: FormControl
  readonly maxDescriptionLength = 500
  constructor(private fb: FormBuilder) {
    this.descriptionCtrl = fb.control('', [ Validators.maxLength(this.maxDescriptionLength)])
  }

  ngOnInit(): void {
    this.descriptionCtrlReady.emit(this.descriptionCtrl);
  }

}
