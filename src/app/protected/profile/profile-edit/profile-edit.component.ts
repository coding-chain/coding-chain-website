import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/user-state.service';
import {SaveUser} from '../../../shared/models/users/save-user';
import {eqCtrlsValidator} from '../../../shared/validators/value.validators';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styles: []
})
export class ProfileEditComponent implements OnInit {
  user$: Subject<ConnectedUser>;

  userForm: FormGroup;
  passwordForm: FormGroup;
  usernameCtrl: FormControl;
  emailCtrl: FormControl;
  pwdCtrl: FormControl;
  confirmPwdCtrl: FormControl;

  user: SaveUser = {username: '', email: '', password: ''};

  get isFormValid(): boolean {
    return this.userForm.valid;
  }

  constructor(private userStateService: UserStateService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;
    // TODO put user info into the fields


    this.usernameCtrl = this.fb.control(this.user?.username,
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.emailCtrl = this.fb.control(this.user?.email,
      [Validators.required, Validators.email]);
    this.pwdCtrl = this.fb.control('',
      [Validators.required, Validators.minLength(8)]);
    this.confirmPwdCtrl = this.fb.control('', [Validators.required]);
    this.passwordForm = this.fb.group(
      {password: this.pwdCtrl, confirm: this.confirmPwdCtrl},
      {validators: eqCtrlsValidator([this.confirmPwdCtrl, this.pwdCtrl])}
    );
    this.userForm = this.fb.group({
        username: this.usernameCtrl,
        email: this.emailCtrl,
        passwordForm: this.passwordForm
      }
    );

    this.user$.subscribe(user => {
      this.usernameCtrl.setValue(user.username);
      this.emailCtrl.setValue(user.email);
    });
  }

  onSubmitUser(): void {
    this.user.email = this.emailCtrl.value;
    this.user.username = this.usernameCtrl.value;
    this.user.password = this.pwdCtrl.value;
    // TODO this.userService.saveUser(this.user);
  }

}
