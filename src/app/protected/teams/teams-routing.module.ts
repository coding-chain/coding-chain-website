import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeamRootComponent} from './teams-root/team-root.component';
import {TeamsListComponent} from './teams-list/teams-list.component';
import {TeamsEditComponent} from './teams-edit/teams-edit.component';
import {TeamAdminGuardService} from '../../core/guards/team-admin-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: '', component: TeamRootComponent, children: [
      {path: 'list', component: TeamsListComponent},
      {path: ':id/edit', canActivate: [TeamAdminGuardService], component: TeamsEditComponent},
      {path: 'create', component: TeamsEditComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule {
}
