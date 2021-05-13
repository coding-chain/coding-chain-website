import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TournamentsRoutingModule} from './tournaments-routing.module';
import {TournamentsRootComponent} from './tournaments-root/tournaments-root.component';
import {TournamentsListComponent} from './tournaments-list/tournaments-list.component';
import {TournamentsEditComponent} from './tournaments-edit/tournaments-edit.component';
import {TournamentsNavbarComponent} from './tournaments-navbar/tournaments-navbar.component';
import {SharedModule} from '../../shared/shared.module';
import {TournamentsCreateFormComponent} from './tournaments-create-form/tournaments-create-form.component';
import {TournamentsCreateComponent} from './tournaments-create/tournaments-create.component';
import {TournamentsEditNameInputComponent} from './tournaments-edit-name-input/tournaments-edit-name-input.component';
import {TournamentsEditDescriptionInputComponent} from './tournaments-edit-description-input/tournaments-edit-description-input.component';
import {TournamentsFilterFormComponent} from './tournaments-filter-form/tournaments-filter-form.component';
import {TournamentsItemComponent} from './tournaments-item/tournaments-item.component';
import {TournamentsEditFormComponent} from './tournaments-edit-form/tournaments-edit-form.component';
import { TournamentsEditStepsListComponent } from './tournaments-edit-steps-list/tournaments-edit-steps-list.component';
import { StepsEditItemComponent } from './steps-edit-item/steps-edit-item.component';
import { StepsEditDetailDialogComponent } from './steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import { StepsEditTestsDialogComponent } from './steps-edit-tests-dialog/steps-edit-tests-dialog.component';


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
    TournamentsItemComponent,
    TournamentsEditFormComponent,
    TournamentsEditStepsListComponent,
    StepsEditItemComponent,
    StepsEditDetailDialogComponent,
    StepsEditTestsDialogComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule,
    SharedModule
  ],
  entryComponents:[
    StepsEditDetailDialogComponent,
    StepsEditTestsDialogComponent
  ]
})
export class TournamentsModule {
}
