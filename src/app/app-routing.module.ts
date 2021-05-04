import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {NoMatchRedirectGuardService} from './core/guards/no-match-redirect-guard.service';
import {HomeRootComponent} from './public/home/home-root/home-root.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: HomeRootComponent, canActivate: [NoMatchRedirectGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule, ReactiveFormsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
