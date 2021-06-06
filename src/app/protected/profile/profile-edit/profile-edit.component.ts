import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {SaveUser} from '../../../shared/models/users/save-user';
import {eqCtrlsIfExistsValidator, eqCtrlsValidator} from '../../../shared/validators/value.validators';
import {AuthenticationService} from '../../../core/services/http/authentication.service';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';


interface Body {
  password?: string;
  username?: string;
  email?: string;
}

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
  hidePassword: boolean;
  hideConfirmPassword: boolean;

  user: SaveUser = {username: '', email: '', password: ''};

  get isFormValid(): boolean {
    return this.userForm.valid;
  }

  constructor(private userStateService: UserStateService, private fb: FormBuilder, private authenticationService: AuthenticationService) {
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;

    this.usernameCtrl = this.fb.control(this.user?.username,
      [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.emailCtrl = this.fb.control(this.user?.email,
      [Validators.required, Validators.email]);
    this.pwdCtrl = this.fb.control(undefined,
      [Validators.minLength(8)]);
    this.confirmPwdCtrl = this.fb.control(undefined, []);
    this.passwordForm = this.fb.group(
      {password: this.pwdCtrl, confirm: this.confirmPwdCtrl},
      {validators: eqCtrlsIfExistsValidator([this.confirmPwdCtrl, this.pwdCtrl])}
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

  isDisabled(): boolean {
    let hasChanges = false;
    if (!!this.pwdCtrl.value || !!this.confirmPwdCtrl.value) {
      hasChanges = true;
    }

    this.user$.subscribe(user => {
      if (this.usernameCtrl.value && this.usernameCtrl.value !== user.username) {
        hasChanges = true;
      }
      if (this.emailCtrl.value && this.emailCtrl.value !== user.email) {
        hasChanges = true;
      }
    });

    return hasChanges;
  }

  onSubmitUser(): void {
    const body: Body = {};
    if (this.pwdCtrl.value) {
      body.password = this.pwdCtrl.value;
    }
    if (this.usernameCtrl.value && this.usernameCtrl.value !== this.user.username) {
      body.username = this.usernameCtrl.value;
    }
    if (this.emailCtrl.value && this.emailCtrl.value !== this.user.email) {
      body.email = this.emailCtrl.value;
    }
    if (body !== {}) {
      this.authenticationService.updateMe(body).subscribe(
        user => {
          this.userStateService.updateUser(user);
          Swal.fire(SwalUtils.successOptions('Vos informations on bien été mise à jour'));
        }
      );
    }

  }
}
