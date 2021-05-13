import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TeamRootComponent} from './team-root/team-root.component';
import {TeamPageComponent} from './team-page/team-page.component';

const routes: Routes = [

  {
    path: '', component: TeamRootComponent, children: [
      {path: '', component: TeamPageComponent},
      {path: ':id', component: TeamPageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }
