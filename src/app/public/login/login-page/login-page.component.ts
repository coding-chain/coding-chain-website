import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../core/services/http/authentication.service';
import {LoginUser} from '../../../shared/models/users/login-user';
import Swal from 'sweetalert2';
import {UserStateService} from 'src/app/core/services/user-state.service';
import {ConnectedUser} from 'src/app/shared/models/users/connected-user';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: []
})
export class LoginPageComponent implements OnInit {

  isLoading = false;

  constructor(private authService: AuthenticationService, private userStateService: UserStateService, private router: Router) {
  }

  ngOnInit(): void {
  }

  logUser(user: LoginUser): void {
    this.isLoading = true;
    this.authService.login(user).subscribe(
      res => {
        this.isLoading = false;
        this.router.navigate(['/home']);
        this.userStateService.updateUser(new ConnectedUser(res));
      }, err => {
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          icon: 'error',
          text: 'Utilisateur inconnu!'
        });
      }
    );

  }
}
