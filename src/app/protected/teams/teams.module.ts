import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TeamRootComponent} from './teams-root/team-root.component';
import {TeamsPageComponent} from './teams-page/teams-page.component';
import {TeamsRoutingModule} from './teams-routing.module';
import {TeamsFormComponent} from './teams-form/teams-form.component';
import {SharedModule} from '../../shared/shared.module';
import {TeamTeammateComponent} from './teams-teammate/team-teammate.component';
import { TeamsListComponent } from './teams-list/teams-list.component';
import { TeamsFilterComponent } from './teams-filter/teams-filter.component';
import { TeamsEditComponent } from './teams-edit/teams-edit.component';
import { TeamsNavbarComponent } from './teams-navbar/teams-navbar.component';
import {TeamsDeleteButtonComponent} from './teams-delete-button/teams-delete-button.component';
import {TeamsDeleteDialogComponent} from './teams-delete-dialog/teams-delete-dialog.component';
import { TeamsItemComponent } from './teams-item/teams-item.component';
import { MemberFilterComponent } from './member-filter/member-filter.component';
import { TeamsMemberItemComponent } from './teams-member-item/teams-member-item.component';


@NgModule({
  declarations: [
    TeamRootComponent,
    TeamsPageComponent,
    TeamTeammateComponent,
    TeamsFormComponent,
    TeamsDeleteButtonComponent,
    TeamsDeleteDialogComponent,
    TeamsListComponent,
    TeamsFilterComponent,
    TeamsEditComponent,
    TeamsNavbarComponent,
    TeamsItemComponent,
    MemberFilterComponent,
    TeamsMemberItemComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule
  ]
})
export class TeamsModule { }
