import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';
import {TotalComponent} from './components/total/total.component';
import {PagedListComponent} from './components/paged-list/paged-list.component';
import {SortByArrowsComponent} from './components/sort-by-arrows/sort-by-arrows.component';
import {BootstrapModule} from './bootstrap.module';
import {StarRateComponent} from './components/star-rate/star-rate.component';
import {MonacoEditorModule} from '@materia-ui/ngx-monaco-editor';
import {QuillModule} from 'ngx-quill';


@NgModule({
  declarations: [TotalComponent, PagedListComponent, SortByArrowsComponent, StarRateComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    BootstrapModule,
    ReactiveFormsModule,
    FormsModule,
    MonacoEditorModule,
    QuillModule.forRoot()
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    TotalComponent,
    PagedListComponent,
    StarRateComponent,
    SortByArrowsComponent,
    BootstrapModule,
    FormsModule,
    MonacoEditorModule,
    QuillModule
  ]
})
export class SharedModule {
}
