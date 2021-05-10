import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TeamRootComponent} from './team-root/team-root.component';
import {TeamPageComponent} from './team-page/team-page.component';
import {TeamRoutingModule} from './team-routing.module';


@NgModule({
  declarations: [
    TeamRootComponent,
    TeamPageComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule
  ]
})
export class TeamModule { }
