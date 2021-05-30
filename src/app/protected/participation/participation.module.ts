import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ParticipationRoutingModule} from './participation-routing.module';
import {ParticipationRootComponent} from './participation-root/participation-root.component';
import {ParticipationPageComponent} from './participation-page/participation-page.component';
import {ParticipationFunctionsListComponent} from './participation-functions-list/participation-functions-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ParticipationFunctionsItemComponent} from './participation-functions-item/participation-functions-item.component';
import {ParticipationFunctionsStepComponent} from './participation-functions-step/participation-functions-step.component';
import {ParticipationPipelineFunctionsListComponent} from './participation-pipeline-functions-list/participation-pipeline-functions-list.component';
import { ParticipationEditFunctionDialogComponent } from './participation-edit-function-dialog/participation-edit-function-dialog.component';
import { ParticipationEditFunctionFormComponent } from './participation-edit-function-form/participation-edit-function-form.component';


@NgModule({
  declarations: [
    ParticipationRootComponent,
    ParticipationPageComponent,
    ParticipationFunctionsListComponent,
    ParticipationFunctionsItemComponent,
    ParticipationFunctionsStepComponent,
    ParticipationFunctionsStepComponent,
    ParticipationPipelineFunctionsListComponent,
    ParticipationEditFunctionDialogComponent,
    ParticipationEditFunctionFormComponent
  ],
  imports: [
    CommonModule,
    ParticipationRoutingModule,
    SharedModule
  ]
})
export class ParticipationModule {
}
