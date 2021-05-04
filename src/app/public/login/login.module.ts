import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginRootComponent } from './login-root/login-root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    LoginRootComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
