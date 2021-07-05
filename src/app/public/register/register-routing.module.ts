import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterRootComponent} from './register-root/register-root.component';
import {RegisterPageComponent} from './register-page/register-page.component';

const routes: Routes = [
  {
    path: '', component: RegisterRootComponent, children: [
      {path: '', component: RegisterPageComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {
}
