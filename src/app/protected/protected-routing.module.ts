import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../core/guards/auth-guard.service';
import {UserStateService} from '../core/services/user-state.service';
import {ProtectedRootComponent} from './protected-root/protected-root.component';


const routes: Routes = [
  {
    path: '', component: ProtectedRootComponent, canActivate: [AuthGuardService], children: [
      {path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserStateService]
})
export class ProtectedRoutingModule {
}
