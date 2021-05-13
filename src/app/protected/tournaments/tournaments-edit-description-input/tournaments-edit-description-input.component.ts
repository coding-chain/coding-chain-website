import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-description-input',
  templateUrl: './tournaments-edit-description-input.component.html',
  styles: []
})
export class TournamentsEditDescriptionInputComponent implements OnInit {

  @Output() descriptionCtrlReady = new EventEmitter<FormControl>();
  descriptionCtrl: FormControl;
  @Input() maxDescriptionLength = 500;

  constructor(private fb: FormBuilder) {
  }

  @Input()  description: string;

  ngOnInit(): void {
    this.descriptionCtrl = this.fb.control(this.description, [Validators.maxLength(this.maxDescriptionLength)]);
    this.descriptionCtrlReady.emit(this.descriptionCtrl);
  }

}
