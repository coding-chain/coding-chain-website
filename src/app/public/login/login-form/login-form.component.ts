import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {LoginUser} from '../../../shared/models/users/login-user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styles: [
  ]
})
export class LoginFormComponent implements OnInit {

  userLoginForm: FormGroup;
  emailCtrl: FormControl;
  userPwdCtrl: FormControl;
  rememberMeCtrl: FormControl;

  @Output() validUserChange = new EventEmitter<LoginUser>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.emailCtrl = this.formBuilder.control('', [ Validators.required, Validators.email]);
    this.userPwdCtrl = this.formBuilder.control('', Validators.required);
    this.rememberMeCtrl = this.formBuilder.control(false);
    this.userLoginForm = this.formBuilder.group({
        email: this.emailCtrl,
        password: this.userPwdCtrl,
        rememberMe: this.rememberMeCtrl
      }
    );
  }

  isFormValid(): boolean {
    return this.userLoginForm.valid;
  }

  attemptLogin(): void {
    this.validUserChange.emit({
      email: this.emailCtrl.value,
      password: this.userPwdCtrl.value,
      rememberMe: this.rememberMeCtrl.value
    });
  }
}
