import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlagiarismRootComponent } from './plagiarism-root/plagiarism-root.component';
import { PlagiarismListComponent } from './plagiarism-list/plagiarism-list.component';
import {PlagiarismRoutingModule} from './plagiarism-routing.module';
import { PlagiarismFilterComponent } from './plagiarism-filter/plagiarism-filter.component';
import { SuspectFunctionItemComponent } from './suspect-function-item/suspect-function-item.component';
import {SharedModule} from '../../shared/shared.module';
import { PlagiarizedFunctionComponent } from './plagiarized-function/plagiarized-function.component';
import { PlagiarismCompareFunctionsDialogComponent } from './plagiarism-compare-functions-dialog/plagiarism-compare-functions-dialog.component';



@NgModule({
  declarations: [
    PlagiarismRootComponent,
    PlagiarismListComponent,
    PlagiarismFilterComponent,
    SuspectFunctionItemComponent,
    PlagiarizedFunctionComponent,
    PlagiarismCompareFunctionsDialogComponent
  ],
  imports: [
    CommonModule,
    PlagiarismRoutingModule,
    SharedModule
  ]
})
export class PlagiarismModule { }
