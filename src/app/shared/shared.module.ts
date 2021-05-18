import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './modules/angular-material.module';
import {TotalComponent} from './components/total/total.component';
import {PagedListComponent} from './components/paged-list/paged-list.component';
import {SortByArrowsComponent} from './components/sort-by-arrows/sort-by-arrows.component';
import {BootstrapModule} from './modules/bootstrap.module';
import {StarRateComponent} from './components/star-rate/star-rate.component';
import {MonacoEditorModule} from '@materia-ui/ngx-monaco-editor';
import {QuillModule} from 'ngx-quill';
import {MatDialogExpanderDirective} from './directives/mat-dialog-expander.directive';
import {MatDialogExpandedContentDirective} from './directives/mat-dialog-expanded-content.directive';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [
    TotalComponent,
    PagedListComponent,
    SortByArrowsComponent,
    StarRateComponent,
    MatDialogExpanderDirective,
    MatDialogExpandedContentDirective
  ],
  imports: [
    ChartsModule,
    CommonModule,
    AngularMaterialModule,
    BootstrapModule,
    ReactiveFormsModule,
    FormsModule,
    MonacoEditorModule,
    QuillModule.forRoot()
  ],
  exports: [
    ChartsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    TotalComponent,
    PagedListComponent,
    StarRateComponent,
    SortByArrowsComponent,
    BootstrapModule,
    FormsModule,
    MonacoEditorModule,
    QuillModule,
    MatDialogExpanderDirective,
    MatDialogExpandedContentDirective
  ]
})
export class SharedModule {
}
