import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../core/services/http/authentication.service';
import {LoginUser} from '../../../shared/models/users/login-user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: []
})
export class LoginPageComponent implements OnInit {


  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
  }

  logUser(user: LoginUser): void {
    this.authService.login(user).subscribe(
      res => this.router.navigate(['/home']), err => Swal.fire({
        title: 'Erreur',
        icon: 'error',
        text: 'Utilisateur inconnu!'
      })
    );

  }
}
