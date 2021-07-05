import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ParticipationRoutingModule} from './participation-routing.module';
import {ParticipationRootComponent} from './participation-root/participation-root.component';
import {ParticipationPageComponent} from './participation-page/participation-page.component';
import {ParticipationFunctionsListComponent} from './participation-functions-list/participation-functions-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ParticipationFunctionsItemComponent} from './participation-functions-item/participation-functions-item.component';
import {ParticipationPipelineFunctionsListComponent} from './participation-pipeline-functions-list/participation-pipeline-functions-list.component';
import {ParticipationEditFunctionDialogComponent} from './participation-edit-function-dialog/participation-edit-function-dialog.component';
import {ParticipationEditFunctionFormComponent} from './participation-edit-function-form/participation-edit-function-form.component';
import { ParticipationStepComponent } from './participation-step/participation-step.component';
import { ParticipationUsersComponent } from './participation-users/participation-users.component';
import { ParticipationUserItemComponent } from './participation-user-item/participation-user-item.component';
import { ParticipationTestsComponent } from './participation-tests/participation-tests.component';
import { ParticipationTestItemComponent } from './participation-test-item/participation-test-item.component';
import { ParticipationActionsComponent } from './participation-actions/participation-actions.component';


@NgModule({
  declarations: [
    ParticipationRootComponent,
    ParticipationPageComponent,
    ParticipationFunctionsListComponent,
    ParticipationFunctionsItemComponent,
    ParticipationPipelineFunctionsListComponent,
    ParticipationEditFunctionDialogComponent,
    ParticipationEditFunctionFormComponent,
    ParticipationStepComponent,
    ParticipationUsersComponent,
    ParticipationUserItemComponent,
    ParticipationTestsComponent,
    ParticipationTestItemComponent,
    ParticipationActionsComponent
  ],
  imports: [
    CommonModule,
    ParticipationRoutingModule,
    SharedModule
  ]
})
export class ParticipationModule {
}
