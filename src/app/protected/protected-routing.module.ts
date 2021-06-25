import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../core/guards/auth-guard.service';
import {UserStateService} from '../core/services/states/user-state.service';
import {ProtectedRootComponent} from './protected-root/protected-root.component';


const routes: Routes = [
  {
    path: '', component: ProtectedRootComponent, canActivate: [AuthGuardService], children: [
      {path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)},
      {path: 'participations', loadChildren: () => import('./participation/participation.module').then(m => m.ParticipationModule)},
      {path: 'tournaments', loadChildren: () => import ('./tournaments/tournaments.module').then(m => m.TournamentsModule)},
      {path: 'steps', loadChildren: () => import ('./steps/steps.module').then(m => m.StepsModule)},
      {path: 'teams', loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule)},
      {path: 'plagiarism', loadChildren: () => import('./plagiarism/plagiarism.module').then(m => m.PlagiarismModule)},
      {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
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
