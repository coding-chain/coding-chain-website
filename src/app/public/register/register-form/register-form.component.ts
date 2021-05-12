import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {eqCtrlsValidator} from '../../../shared/validators/value.validators';
import {RegisterUser} from '../../../shared/models/users/register-user';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styles: []
})
export class RegisterFormComponent implements OnInit {

  userForm: FormGroup;
  passwordForm: FormGroup;

  usernameCtrl: FormControl;
  emailCtrl: FormControl;
  pwdCtrl: FormControl;
  confirmPwdCtrl: FormControl;
  rememberMeCtrl: FormControl;

  user: RegisterUser = {username: '', email: '', password: '', rememberMe: false};

  @Output() validUserChange = new EventEmitter<RegisterUser>();

  constructor(private fb: FormBuilder) {
  }

  get isFormValid(): boolean {
    return this.userForm.valid;
  }

  ngOnInit(): void {
    this.usernameCtrl = this.fb.control(this.user?.username,
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.emailCtrl = this.fb.control(this.user?.email,
      [Validators.required, Validators.email]);
    this.pwdCtrl = this.fb.control('',
      [Validators.required, Validators.minLength(8)]);
    this.confirmPwdCtrl = this.fb.control('', [Validators.required]);
    this.rememberMeCtrl = this.fb.control(false);
    this.passwordForm = this.fb.group(
      {password: this.pwdCtrl, confirm: this.confirmPwdCtrl},
      {validators: eqCtrlsValidator([this.confirmPwdCtrl, this.pwdCtrl])}
    );
    this.userForm = this.fb.group({
        username: this.usernameCtrl,
        email: this.emailCtrl,
        passwordForm: this.passwordForm,
        rememberMe: this.rememberMeCtrl
      }
    );
  }

  onSubmitUser(): void {
    this.user.email = this.emailCtrl.value;
    this.user.username = this.usernameCtrl.value;
    this.user.password = this.pwdCtrl.value;
    this.user.rememberMe = this.rememberMeCtrl.value;
    this.validUserChange.emit(this.user);
  }

  reset(): void {
    this.userForm.reset({
      username: this.user.username,
      email: this.user.email,
      rememberMe: false
    });
    this.passwordForm.reset({
      password: '',
      confirm: ''
    });

  }
}
