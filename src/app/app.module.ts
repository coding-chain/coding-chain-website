import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {CoreModule} from './core/core.module';
import {PublicModule} from './public/public.module';
import {ProtectedModule} from './protected/protected.module';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UsersRootComponent } from './protected/users/users-root/users-root.component';
import { UsersListComponent } from './protected/users/users-list/users-list.component';
import { UsersFilterComponent } from './protected/users/users-filter/users-filter.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    PublicModule,
    ProtectedModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr-fr'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
