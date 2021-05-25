import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileRootComponent} from './profile-root/profile-root.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {ProfileDetailsComponent} from './profile-details/profile-details.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    ProfileRootComponent,
    ProfileEditComponent,
    ProfileDetailsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule {
}
