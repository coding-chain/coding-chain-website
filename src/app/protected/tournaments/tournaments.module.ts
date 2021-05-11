import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentsRoutingModule } from './tournaments-routing.module';
import { TournamentsRootComponent } from './tournaments-root/tournaments-root.component';
import { TournamentsListComponent } from './tournaments-list/tournaments-list.component';
import { TournamentsEditComponent } from './tournaments-edit/tournaments-edit.component';
import { TournamentsNavbarComponent } from './tournaments-navbar/tournaments-navbar.component';
import {SharedModule} from "../../shared/shared.module";
import { TournamentsCreateFormComponent } from './tournaments-create-form/tournaments-create-form.component';
import { TournamentsCreateComponent } from './tournaments-create/tournaments-create.component';
import { TournamentsEditNameInputComponent } from './tournaments-edit-name-input/tournaments-edit-name-input.component';
import { TournamentsEditDescriptionInputComponent } from './tournaments-edit-description-input/tournaments-edit-description-input.component';
import { TournamentsFilterFormComponent } from './tournaments-filter-form/tournaments-filter-form.component';
import { TournamentsItemComponent } from './tournaments-item/tournaments-item.component';


@NgModule({
  declarations: [
    TournamentsRootComponent,
    TournamentsListComponent,
    TournamentsEditComponent,
    TournamentsCreateComponent,
    TournamentsNavbarComponent,
    TournamentsCreateFormComponent,
    TournamentsEditNameInputComponent,
    TournamentsEditDescriptionInputComponent,
    TournamentsFilterFormComponent,
    TournamentsItemComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule,
    SharedModule
  ]
})
export class TournamentsModule { }