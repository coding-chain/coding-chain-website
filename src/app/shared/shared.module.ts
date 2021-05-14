import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';
import {TotalComponent} from './components/total/total.component';
import {PagedListComponent} from './components/paged-list/paged-list.component';
import {SortByArrowsComponent} from './components/sort-by-arrows/sort-by-arrows.component';
import {BootstrapModule} from './bootstrap.module';
import {StarRateComponent} from './components/star-rate/star-rate.component';


@NgModule({
  declarations: [TotalComponent, PagedListComponent, SortByArrowsComponent,StarRateComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    BootstrapModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    TotalComponent,
    PagedListComponent,
    StarRateComponent,
    SortByArrowsComponent, BootstrapModule, FormsModule
  ]
})
export class SharedModule {
}
