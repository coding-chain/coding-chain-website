import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';
import {TotalComponent} from './components/total/total.component';
import {PagedListComponent} from './components/paged-list/paged-list.component';
import {SortByArrowsComponent} from './components/sort-by-arrows/sort-by-arrows.component';


@NgModule({
  declarations: [TotalComponent, PagedListComponent, SortByArrowsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    TotalComponent,
    PagedListComponent,
    SortByArrowsComponent
  ]
})
export class SharedModule {
}
