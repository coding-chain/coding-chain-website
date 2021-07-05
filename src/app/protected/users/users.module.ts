import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersRootComponent} from './users-root/users-root.component';
import {UsersListComponent} from './users-list/users-list.component';
import {UsersFilterComponent} from './users-filter/users-filter.component';
import {UsersItemComponent} from './users-item/users-item.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {UsersRoutingModule} from './users.routing.module';


@NgModule({
  declarations: [
    UsersRootComponent,
    UsersListComponent,
    UsersFilterComponent,
    UsersItemComponent
  ],
  imports: [
    UsersRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class UsersModule {
}
