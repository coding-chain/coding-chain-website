import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-tournaments-edit-description-input',
  templateUrl: './tournaments-edit-description-input.component.html',
  styles: []
})
export class TournamentsEditDescriptionInputComponent implements OnInit {

  @Input() descriptionCtrl: FormControl;
  @Input() maxDescriptionLength = 500;
  @Input() description: string;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.descriptionCtrl.setValidators([Validators.maxLength(this.maxDescriptionLength)]);
  }

}
