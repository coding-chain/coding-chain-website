import {Component, Renderer2} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {UserStateService} from './core/services/states/user-state.service';
import {ThemeService} from './core/services/states/theme.service';
import {TournamentService} from './core/services/http/tournament.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean;

  constructor(private readonly router: Router,
              private readonly userStateService: UserStateService,
              private readonly _themeService: ThemeService,
              private readonly _renderer: Renderer2) {
    this.userStateService.loadUser();
    this.loading = false;
    this._themeService.themeSubject$.subscribe(theme => {
      if (theme === 'dark') {
        this._renderer.addClass(document.body, 'dark-theme');
        this._renderer.removeClass(document.body, 'light-theme');
      } else {
        this._renderer.addClass(document.body, 'light-theme');
        this._renderer.removeClass(document.body, 'dark-theme');
      }
    });
    router.events.subscribe(
      (event: any): void => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd) {
          this.loading = false;
        }
      }
    );
    this._themeService.publishTheme();
  }
}
