import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginRootComponent} from './login-root/login-root.component';
import {LoginPageComponent} from './login-page/login-page.component';

const routes: Routes = [
  {
    path: '', component: LoginRootComponent, children: [
      {path: '', component: LoginPageComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
