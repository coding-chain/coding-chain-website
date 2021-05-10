import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipationRoutingModule } from './participation-routing.module';
import { ParticipationRootComponent } from './participation-root/participation-root.component';
import { ParticipationPageComponent } from './participation-page/participation-page.component';


@NgModule({
  declarations: [
    ParticipationRootComponent,
    ParticipationPageComponent
  ],
  imports: [
    CommonModule,
    ParticipationRoutingModule
  ]
})
export class ParticipationModule { }
