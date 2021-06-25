import {RouterModule, Routes} from '@angular/router';
import {TournamentsRootComponent} from '../tournaments/tournaments-root/tournaments-root.component';
import {TournamentsListComponent} from '../tournaments/tournaments-list/tournaments-list.component';
import {TournamentsCreateComponent} from '../tournaments/tournaments-create/tournaments-create.component';
import {IRightData, RoleGuard} from '../../core/guards/role-guard.service';
import {TournamentsEditComponent} from '../tournaments/tournaments-edit/tournaments-edit.component';
import {TournamentSummaryComponent} from '../tournaments/tournament-summary/tournament-summary.component';
import {NgModule} from '@angular/core';
import {UsersRootComponent} from './users-root/users-root.component';
import {UsersListComponent} from './users-list/users-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {
    path: '', component: UsersRootComponent, children: [
      {path: 'list', component: UsersListComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
