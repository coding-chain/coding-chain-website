import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepsEditTestsDialogComponent} from './steps-edit-tests-dialog/steps-edit-tests-dialog.component';
import {StepsEditDetailDialogComponent} from './steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {StepsEditItemComponent} from './steps-edit-item/steps-edit-item.component';
import {SharedModule} from '../../shared/shared.module';
import { StepsTestEditItemComponent } from './steps-test-edit-item/steps-test-edit-item.component';
import { StepsEditTestsComponent } from './steps-edit-tests/steps-edit-tests.component';
import { StepsEditDetailComponent } from './steps-edit-detail/steps-edit-detail.component';
import { StepsTransferDialogComponent } from './steps-list-dialog/steps-transfer-dialog.component';
import { StepsListComponent } from './steps-list/steps-list.component';
import { StepsFilterFormComponent } from './steps-filter-form/steps-filter-form.component';
import { StepsItemComponent } from './steps-item/steps-item.component';
import { StepsTransferComponent } from './steps-transfer/steps-transfer.component';


@NgModule({
  declarations: [StepsEditItemComponent, StepsEditDetailDialogComponent, StepsEditTestsDialogComponent, StepsTestEditItemComponent, StepsEditTestsComponent, StepsEditDetailComponent, StepsTransferDialogComponent, StepsListComponent, StepsFilterFormComponent, StepsItemComponent, StepsTransferComponent],
  imports: [
    CommonModule, SharedModule
  ],
  exports: [
    StepsEditDetailDialogComponent, StepsEditDetailDialogComponent, StepsEditItemComponent
  ],
  entryComponents: [
    StepsEditTestsDialogComponent, StepsEditDetailDialogComponent, StepsTransferDialogComponent
  ]
})
export class StepsModule {
}
