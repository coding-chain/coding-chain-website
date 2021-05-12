import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeRootComponent} from './home-root/home-root.component';

const routes: Routes = [
  {
    path: '', component: HomeRootComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
