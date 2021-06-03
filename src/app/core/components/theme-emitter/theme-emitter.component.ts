import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {IThemeColors, ThemeService} from '../../services/states/theme.service';
import {ColorsUtils} from '../../../shared/utils/colors.utils';

@Component({
  selector: 'app-theme-emitter',
  templateUrl: './theme-emitter.component.html',
  styleUrls: ['./theme-emitter.component.scss']
})
export class ThemeEmitterComponent implements AfterViewInit {

  @ViewChild('primary') primaryElement: ElementRef;
  @ViewChild('accent') accentElement: ElementRef;
  @ViewChild('warn') warnElement: ElementRef;
  private colors: IThemeColors;

  constructor(private readonly themeService: ThemeService) {
  }

  ngAfterViewInit(): void {
    this.themeService.themeSubject$.subscribe(theme => {
      this.setColors();
      this.themeService.updateColors(this.colors);
    });
    this.setColors();
    this.themeService.updateColors(this.colors);
  }

  private setColors(): void {
    const primary = this.parseRgbColorToHex(getComputedStyle(this.primaryElement.nativeElement).color);
    const accent = this.parseRgbColorToHex(getComputedStyle(this.accentElement.nativeElement).color);
    const warn = this.parseRgbColorToHex(getComputedStyle(this.warnElement.nativeElement).color);
    this.colors = {primary, accent, warn};
  }

  private parseRgbColorToHex(color: string): string {
    color = color.replace('rgb', '').replace('(', '').replace(')', '');
    const rgb = color.split(',').map(el => Number(el));
    return ColorsUtils.rgbToHex(rgb[0], rgb[1], rgb[2]);
  }

}
