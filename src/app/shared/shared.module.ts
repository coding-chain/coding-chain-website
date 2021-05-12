import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';
import {TotalComponent} from './components/total/total.component';
import {PagedListComponent} from './components/paged-list/paged-list.component';
import {LanguagesSelectorComponent} from './components/languages-selector/languages-selector.component';
import {TournamentNameFilterInputComponent} from './components/tournament-name-filter-input/tournament-name-filter-input.component';
import {SortByArrowsComponent} from './components/sort-by-arrows/sort-by-arrows.component';
import {TournamentsInTeamFilterInputComponent} from './components/tournaments-in-team-filter-input/tournaments-in-team-filter-input.component';


@NgModule({
  declarations: [TotalComponent, PagedListComponent, LanguagesSelectorComponent, TournamentNameFilterInputComponent, SortByArrowsComponent, TournamentsInTeamFilterInputComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    TotalComponent,
    PagedListComponent,
    LanguagesSelectorComponent,
    TournamentNameFilterInputComponent,
    SortByArrowsComponent,
    TournamentsInTeamFilterInputComponent
  ]
})
export class SharedModule {
}
