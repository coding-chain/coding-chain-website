import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {Theme} from '../../../core/services/states/theme.service';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['home-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel: ElementRef<HTMLDivElement>;
  @Input() tournaments: ITournamentResume[];

  @Input() set theme(theme: Theme) {
    this._theme = theme;
    this.setIndicatorsColorByTheme();
  }

  _theme: Theme;
  @Input() currentUser: ConnectedUser;
  @Output() tournamentLeft = new EventEmitter<ITeamNavigation[]>();
  private carouselIndicators: Element;

  constructor() {
  }

  ngOnInit(): void {
  }

  onTournamentLeft($event: ITeamNavigation[]): void {
    this.tournamentLeft.emit($event);
  }

  ngAfterViewInit(): void {
    this.carouselIndicators = this.carousel.nativeElement.querySelectorAll('.carousel-indicators')[0];
    const observerConfig = {
      attributes: true,
      childList: true,
      characterData: true
    };
    const observer = new MutationObserver(mutations => {
      this.setIndicatorsColorByTheme();
      if (this.indicators?.length === this.tournaments.length) {
        observer.disconnect();
      }
    });
    observer.observe(this.carouselIndicators, observerConfig);

  }

  get indicators(): NodeListOf<HTMLLIElement> {
    return this.carouselIndicators?.querySelectorAll('li');
  }

  private setIndicatorsColorByTheme(): void {
    this.indicators?.forEach(indicator => {
      console.log(indicator);
      if (this._theme === 'light') {
        indicator.style.backgroundColor = 'black';
      } else {
        indicator.style.backgroundColor = 'white';
      }
    });
  }

  onCarouselReady(): void {
    const carouselTabs = this.carousel.nativeElement.querySelectorAll('.carousel-indicators');
    console.log(carouselTabs[0]);
  }
}
