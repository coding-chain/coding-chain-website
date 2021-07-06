import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_BASE_HREF, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {CoreModule} from './core/core.module';
import {PublicModule} from './public/public.module';
import {ProtectedModule} from './protected/protected.module';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
  providers: [{provide: APP_BASE_HREF, useValue: '/web/'}, {provide: LOCALE_ID, useValue: 'fr-fr'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
