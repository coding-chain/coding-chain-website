import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './code-editor-routing.module';
import {ProfileRootComponent} from './code-editor-root/code-editor-root.component';
import {ProfileEditComponent} from './code-editor-coding/profile-edit.component';


@NgModule({
  declarations: [
    ProfileRootComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule {
}
