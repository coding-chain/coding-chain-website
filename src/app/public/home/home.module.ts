import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeRootComponent} from './home-root/home-root.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import { HomeCarouselComponent } from './home-carousel/home-carousel.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeTournamentItemComponent } from './home-tournament-item/home-tournament-item.component';


@NgModule({
  declarations: [HomeRootComponent, HomeCarouselComponent, HomePageComponent, HomeTournamentItemComponent,
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
