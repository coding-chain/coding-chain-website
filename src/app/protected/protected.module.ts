import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProtectedRootComponent} from './protected-root/protected-root.component';
import {ProtectedRoutingModule} from './protected-routing.module';


@NgModule({
  declarations: [
    ProtectedRootComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    ProtectedRoutingModule
  ]
})
export class ProtectedModule {
}
