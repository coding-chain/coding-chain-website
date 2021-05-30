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
import {SortedInputComponent} from './components/sorted-input/sorted-input.component';
import {LanguagesStatsComponent} from './components/languages-stats/languages-stats.component';
import {NgScrollbarModule} from 'ngx-scrollbar';


@NgModule({
  declarations: [
    TotalComponent,
    PagedListComponent,
    SortByArrowsComponent,
    StarRateComponent,
    MatDialogExpanderDirective,
    MatDialogExpandedContentDirective,
    SortedInputComponent,
    LanguagesStatsComponent
  ],
  imports: [
    ChartsModule,
    CommonModule,
    AngularMaterialModule,
    BootstrapModule,
    ReactiveFormsModule,
    FormsModule,
    MonacoEditorModule,
    NgScrollbarModule,
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
    MatDialogExpandedContentDirective,
    SortedInputComponent,
    LanguagesStatsComponent,
    NgScrollbarModule
  ]
})
export class SharedModule {
}
