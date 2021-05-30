import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './commons/interceptors/token.interceptor';
import {ErrorInterceptor} from './commons/interceptors/error.interceptor';
import {DateInterceptor} from './commons/interceptors/date.interceptor';
import {RouterModule} from '@angular/router';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {SharedModule} from '../shared/shared.module';
import {AuthenticationService} from './services/http/authentication.service';
import {UserStateService} from './services/states/user-state.service';
import {MatButtonModule} from '@angular/material/button';
import {HateoasInterceptor} from './commons/interceptors/hateoas.interceptor';


@NgModule({
  declarations: [NavBarComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    SharedModule,
    MatButtonModule
  ],
  exports: [
    NavBarComponent
  ],
  providers: [AuthenticationService, UserStateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HateoasInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateInterceptor,
      multi: true
    }]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}
