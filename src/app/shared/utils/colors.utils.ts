export interface IAppColor {
  light: string;
  dark: string;
}

export class ColorsUtils {
  public static componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  public static rgbToHex(r: number, g: number, b: number): string {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
}

