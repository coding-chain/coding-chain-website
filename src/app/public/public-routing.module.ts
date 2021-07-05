import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicRootComponent} from './public-root/public-root.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/home'},
  {
    path: '', component: PublicRootComponent, children: [
      {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
      {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
      {path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}

