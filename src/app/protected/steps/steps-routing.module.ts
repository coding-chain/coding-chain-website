import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StepsRootComponent} from './steps-root/steps-root.component';
import {StepsListComponent} from './steps-list/steps-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: '', component: StepsRootComponent, children: [
      {path: 'list', component: StepsListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StepsRoutingModule {
}
