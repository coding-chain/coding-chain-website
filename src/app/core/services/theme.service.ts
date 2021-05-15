import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeSubject$ = new Subject<Theme>();
  private themeKey = environment.themeKey;

  constructor() {

  }

  public updateTheme(theme: Theme): void {
    this.setTheme(theme);
  }

  private setTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
  }

  public publishTheme(): void{
    this.themeSubject$.next(this.theme);
  }

  get theme(): Theme {
    const theme = localStorage.getItem(this.themeKey) as (Theme | any);
    if (theme !== 'light' && theme !== 'dark') {
      return 'light';
    }
    return theme;
  }
}
