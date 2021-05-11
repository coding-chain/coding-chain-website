import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';
import {TotalComponent} from "./components/total/total.component";
import {PagedListComponent} from "./components/paged-list/paged-list.component";


@NgModule({
  declarations: [TotalComponent, PagedListComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    TotalComponent,
    PagedListComponent
  ]
})
export class SharedModule {
}
