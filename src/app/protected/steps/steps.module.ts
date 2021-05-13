import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepsEditTestsDialogComponent} from './steps-edit-tests-dialog/steps-edit-tests-dialog.component';
import {StepsEditDetailDialogComponent} from './steps-edit-detail-dialog/steps-edit-detail-dialog.component';
import {StepsEditItemComponent} from './steps-edit-item/steps-edit-item.component';
import {SharedModule} from '../../shared/shared.module';
import { StepsTestEditItemComponent } from './steps-test-edit-item/steps-test-edit-item.component';


@NgModule({
  declarations: [StepsEditItemComponent, StepsEditDetailDialogComponent, StepsEditTestsDialogComponent, StepsTestEditItemComponent],
  imports: [
    CommonModule, SharedModule
  ],
  exports: [
    StepsEditDetailDialogComponent, StepsEditDetailDialogComponent, StepsEditItemComponent
  ],
  entryComponents: [
    StepsEditTestsDialogComponent, StepsEditDetailDialogComponent
  ]
})
export class StepsModule {
}
