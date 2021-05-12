import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ParticipationRootComponent} from './participation-root/participation-root.component';
import {ParticipationPageComponent} from './participation-page/participation-page.component';

const routes: Routes = [
  {
    path: '', component: ParticipationRootComponent, children: [
      {path: '', component: ParticipationPageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipationRoutingModule {
}
