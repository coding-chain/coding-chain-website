import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services/http/authentication.service';
import {Router} from '@angular/router';
import {RegisterUser} from '../../../shared/models/users/register-user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: []
})
export class RegisterPageComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
  }

  createUser(user: RegisterUser): void {
    this.authService.register(user).subscribe(
      value => this.router.navigate(['/home']),
      err => Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Impossible de créer l\'utilisateur'
      })
    );
  }
}
