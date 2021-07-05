import {Component, Renderer2} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {UserStateService} from './core/services/states/user-state.service';
import {ThemeService} from './core/services/states/theme.service';
import {PlagiarismStateService} from './core/services/states/plagiarism-state.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean;

  constructor(private readonly _router: Router,
              private readonly _userStateService: UserStateService,
              private readonly _themeService: ThemeService,
              private readonly _renderer: Renderer2,
              private readonly _snackBar: MatSnackBar,
              private readonly _plagiarismStateService: PlagiarismStateService) {
    this._userStateService.loadUser();
    this.loading = false;

    _router.events.subscribe(
      (event: any): void => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd) {
          this.loading = false;
        }
      }
    );
    this.bindTheme();
  }

  private bindTheme(): void {
    this._themeService.themeSubject$.subscribe(theme => {
      if (theme === 'dark') {
        this._renderer.addClass(document.body, 'dark-theme');
        this._renderer.removeClass(document.body, 'light-theme');
      } else {
        this._renderer.addClass(document.body, 'light-theme');
        this._renderer.removeClass(document.body, 'dark-theme');
      }
    });
    this._themeService.publishTheme();
    this.listenPlagiarismEvents();
  }

  private listenPlagiarismEvents(): void {
    this._plagiarismStateService.plagiarismAnalyseReady$
      .pipe(debounceTime(4000))
      .subscribe(_ => {
      this._snackBar.open('Une nouvelle analyse de plagiat est prête', null, {duration: 1000});
    });
  }
}
