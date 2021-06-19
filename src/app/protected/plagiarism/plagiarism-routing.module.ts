import {RouterModule, Routes} from '@angular/router';
import {StepsRootComponent} from '../steps/steps-root/steps-root.component';
import {StepsListComponent} from '../steps/steps-list/steps-list.component';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {PlagiarismRootComponent} from './plagiarism-root/plagiarism-root.component';
import {PlagiarismListComponent} from './plagiarism-list/plagiarism-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: '', component: PlagiarismRootComponent, children: [
      {path: 'list', component: PlagiarismListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class PlagiarismRoutingModule {
}
