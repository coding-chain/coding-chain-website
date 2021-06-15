import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TournamentsRoutingModule} from './tournaments-routing.module';
import {TournamentsRootComponent} from './tournaments-root/tournaments-root.component';
import {TournamentsListComponent} from './tournaments-list/tournaments-list.component';
import {TournamentsEditComponent} from './tournaments-edit/tournaments-edit.component';
import {TournamentsNavbarComponent} from './tournaments-navbar/tournaments-navbar.component';
import {SharedModule} from '../../shared/shared.module';
import {TournamentsCreateFormComponent} from './tournaments-create-form/tournaments-create-form.component';
import {TournamentsCreateComponent} from './tournaments-create/tournaments-create.component';
import {TournamentsEditNameInputComponent} from './tournaments-edit-name-input/tournaments-edit-name-input.component';
import {TournamentsEditDescriptionInputComponent} from './tournaments-edit-description-input/tournaments-edit-description-input.component';
import {TournamentsFilterFormComponent} from './tournaments-filter-form/tournaments-filter-form.component';
import {TournamentsItemComponent} from './tournaments-item/tournaments-item.component';
import {TournamentsEditFormComponent} from './tournaments-edit-form/tournaments-edit-form.component';
import {TournamentsEditStepsListComponent} from './tournaments-edit-steps-list/tournaments-edit-steps-list.component';
import {StepsModule} from '../steps/steps.module';
import { TournamentsJoinDialogComponent } from './tournaments-join-dialog/tournaments-join-dialog.component';
import { TournamentsLeaveDialogComponent } from './tournaments-leave-dialog/tournaments-leave-dialog.component';
import {TournamentSummaryDetailsComponent} from './tournament-summary-details/tournament-summary-details.component';
import {TournamentSummaryComponent} from './tournament-summary/tournament-summary.component';
import {TournamentSummaryStepsListComponent} from './tournament-summary-steps-list/tournament-summary-steps-list.component';
import {TournamentSummaryTeamsListComponent} from './tournament-summary-teams-list/tournament-summary-teams-list.component';
import {TournamentSummaryStepComponent} from './tournament-summary-step/tournament-summary-step.component';
import {TournamentSummaryTeamComponent} from './tournament-summary-team/tournament-summary-team.component';


@NgModule({
  declarations: [
    TournamentsRootComponent,
    TournamentsListComponent,
    TournamentsEditComponent,
    TournamentsCreateComponent,
    TournamentsNavbarComponent,
    TournamentsCreateFormComponent,
    TournamentsEditNameInputComponent,
    TournamentsEditDescriptionInputComponent,
    TournamentsFilterFormComponent,
    TournamentsItemComponent,
    TournamentsEditFormComponent,
    TournamentsEditStepsListComponent,
    TournamentsJoinDialogComponent,
    TournamentsLeaveDialogComponent,
    TournamentSummaryComponent,
    TournamentSummaryDetailsComponent,
    TournamentSummaryStepsListComponent,
    TournamentSummaryStepComponent,
    TournamentSummaryTeamsListComponent,
    TournamentSummaryTeamComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule,
    SharedModule,
    StepsModule
  ]
})
export class TournamentsModule {
}
