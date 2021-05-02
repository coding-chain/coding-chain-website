export class DateUtils {
  static undefinedOnInvalidDate(date: any): any | undefined {
    return date instanceof Date && isNaN(date.getTime()) ? undefined : date;
  }
}
