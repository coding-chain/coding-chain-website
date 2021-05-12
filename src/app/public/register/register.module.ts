import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegisterRoutingModule} from './register-routing.module';
import {RegisterRootComponent} from './register-root/register-root.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {RegisterFormComponent} from './register-form/register-form.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    RegisterRootComponent,
    RegisterPageComponent,
    RegisterFormComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    SharedModule
  ]
})
export class RegisterModule {
}
