import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ThemeService as ChartsThemeService} from 'ng2-charts';
import {ChartOptions} from 'chart.js';
import _ from 'lodash';

export type Theme = 'dark' | 'light';

export interface IThemeColors {
  primary: string;
  accent: string;
  warn: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeSubject$ = new Subject<Theme>();
  themeColors$ = new Subject<IThemeColors>();

  private themeKey = environment.themeKey;

  constructor(private readonly _chartsThemeService: ChartsThemeService) {

  }

  private _colors: IThemeColors;

  get colors(): IThemeColors {
    return this._colors;
  }

  get colorsArray(): string[] {
    return [this.colors.accent, this.colors.primary, this.colors.warn];
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

  public updateColors(colors: IThemeColors): void {
    this._colors = colors;
    this.themeColors$.next(_.clone(colors));
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
