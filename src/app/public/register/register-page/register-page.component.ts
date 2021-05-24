import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services/http/authentication.service';
import {Router} from '@angular/router';
import {RegisterUser} from '../../../shared/models/users/register-user';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {UserStateService} from '../../../core/services/user-state.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: []
})
export class RegisterPageComponent implements OnInit {

  isLoading = false;

  constructor(private authService: AuthenticationService, private router: Router, private readonly _userStateService: UserStateService) {
  }

  ngOnInit(): void {
  }

  createUser(user: RegisterUser): void {
    this.isLoading = true;
    this.authService.register(user).pipe(
      switchMap(res => this.authService.login(user)),
      map(res => this._userStateService.updateUser(new ConnectedUser(res))),
      catchError(err => {
        this.isLoading = false;
        Swal.fire(SwalUtils.errorOptions('Erreur durant la création de votre compte'));
        return of([]);
      })
    ).subscribe(value => {
      this.isLoading = false;
      this.router.navigate(['/home']);
    });
  }
}
