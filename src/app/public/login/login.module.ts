import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginRootComponent} from './login-root/login-root.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    LoginRootComponent,
    LoginPageComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule
  ]
})
export class LoginModule {
}
