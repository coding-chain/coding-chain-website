import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ThemeService as ChartsThemeService} from 'ng2-charts';
import {ChartOptions} from 'chart.js';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeSubject$ = new Subject<Theme>();
  private themeKey = environment.themeKey;

  constructor(private readonly _chartsThemeService: ChartsThemeService) {

  }

  get theme(): Theme {
    const theme = localStorage.getItem(this.themeKey) as (Theme | any);
    if (theme !== 'light' && theme !== 'dark') {
      return 'light';
    }
    return theme;
  }

  public updateTheme(theme: Theme): void {
    this.setTheme(theme);
  }

  public publishTheme(): void {
    this.themeSubject$.next(this.theme);
  }

  private setTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
  }

  private changeChartsColorsByTheme(theme: Theme): void {
    let overrides: ChartOptions = {};
    if (theme === 'dark') {
      overrides = {
        legend: {
          labels: {fontColor: 'white'}
        },
        scales: {
          xAxes: [{
            ticks: {fontColor: 'white'},
            gridLines: {color: 'rgba(255,255,255,0.1)'}
          }],
          yAxes: [{
            ticks: {fontColor: 'white'},
            gridLines: {color: 'rgba(255,255,255,0.1)'}
          }]
        }
      };
    }
    this._chartsThemeService.setColorschemesOptions(overrides);
  }
}
