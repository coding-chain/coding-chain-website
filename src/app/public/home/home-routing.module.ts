import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeRootComponent} from './home-root/home-root.component';
import {TournamentsRootComponent} from '../../protected/tournaments/tournaments-root/tournaments-root.component';
import {TournamentsListComponent} from '../../protected/tournaments/tournaments-list/tournaments-list.component';
import {HomePageComponent} from './home-page/home-page.component';

const routes: Routes = [

  {
    path: '', component: HomeRootComponent, children: [
      {path: '', component: HomePageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
