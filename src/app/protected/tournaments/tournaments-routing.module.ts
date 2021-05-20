import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentsRootComponent} from './tournaments-root/tournaments-root.component';
import {TournamentsListComponent} from './tournaments-list/tournaments-list.component';
import {TournamentsEditComponent} from './tournaments-edit/tournaments-edit.component';
import {TournamentsCreateComponent} from './tournaments-create/tournaments-create.component';
import {IRightData, RoleGuard} from '../../core/guards/role-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: '', component: TournamentsRootComponent, children: [
      {path: 'list', component: TournamentsListComponent},
      {path: 'create', component: TournamentsCreateComponent, canActivate: [RoleGuard], data: {rights: ['admin', 'creator']} as IRightData},
      {path: ':id/edit', component: TournamentsEditComponent, canActivate: [RoleGuard], data: {rights: ['admin', 'creator']} as IRightData}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule {
}
