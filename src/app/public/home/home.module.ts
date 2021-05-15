import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeRootComponent} from './home-root/home-root.component';
import {FormsModule} from '@angular/forms';
import {MonacoEditorModule} from '@materia-ui/ngx-monaco-editor';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [HomeRootComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule
  ]
})
export class HomeModule {
}
