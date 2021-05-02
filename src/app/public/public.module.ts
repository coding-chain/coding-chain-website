import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRootComponent } from './public-root/public-root.component';
import {CoreModule} from '../core/core.module';
import {RouterModule} from '@angular/router';
import {PublicRoutingModule} from './public-routing.module';



@NgModule({
  declarations: [
    PublicRootComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
