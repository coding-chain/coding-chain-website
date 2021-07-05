import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepsTestsDialogComponent} from './steps-edit-tests-dialog/steps-tests-dialog.component';
import {StepsEditDetailDialogComponent} from './steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {TournamentStepEditItemComponent} from '../tournaments/tournament-step-edit-item/tournament-step-edit-item.component';
import {SharedModule} from '../../shared/shared.module';
import {StepsTestEditItemComponent} from './steps-test-edit-item/steps-test-edit-item.component';
import {StepsEditTestsComponent} from './steps-edit-tests/steps-edit-tests.component';
import {StepsEditDetailComponent} from './steps-edit-detail/steps-edit-detail.component';
import {StepsTransferDialogComponent} from './steps-transfer-dialog/steps-transfer-dialog.component';
import {StepsListComponent} from './steps-list/steps-list.component';
import {StepsFilterFormComponent} from './steps-filter-form/steps-filter-form.component';
import {StepsItemComponent} from './steps-item/steps-item.component';
import {StepsTransferComponent} from './steps-transfer/steps-transfer.component';
import {StepsRootComponent} from './steps-root/steps-root.component';
import {StepsRoutingModule} from './steps-routing.module';
import {StepsEditItemComponent} from './steps-edit-item/steps-edit-item.component';


@NgModule({
  declarations: [TournamentStepEditItemComponent, StepsEditDetailDialogComponent, StepsTestsDialogComponent, StepsTestEditItemComponent, StepsEditTestsComponent, StepsEditDetailComponent, StepsTransferDialogComponent, StepsListComponent, StepsFilterFormComponent, StepsItemComponent, StepsTransferComponent, StepsRootComponent, StepsEditItemComponent],
  imports: [
    CommonModule,
    StepsRoutingModule,
    SharedModule
  ],
    exports: [
        StepsEditDetailDialogComponent, StepsEditDetailDialogComponent, TournamentStepEditItemComponent, StepsItemComponent
    ],
  entryComponents: [
    StepsTestsDialogComponent, StepsEditDetailDialogComponent, StepsTransferDialogComponent
  ]
})
export class StepsModule {
}
