import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TeamRootComponent} from './team-root/team-root.component';
import {TeamPageComponent} from './team-page/team-page.component';
import {TeamRoutingModule} from './team-routing.module';
import {TeamFormComponent} from './team-form/team-form.component';
import {SharedModule} from '../../shared/shared.module';
import {TeamTeammateComponent} from './team-teammate/team-teammate.component';
import {TeamDeleteButtonComponent} from './team-delete-button/team-delete-button.component';
import {TeamDeleteDialogComponent} from './team-delete-dialog/team-delete-dialog.component';


@NgModule({
  declarations: [
    TeamRootComponent,
    TeamPageComponent,
    TeamTeammateComponent,
    TeamFormComponent,
    TeamDeleteButtonComponent,
    TeamDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    SharedModule
  ]
})
export class TeamModule { }
