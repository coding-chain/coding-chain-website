export class DateUtils {
  static undefinedOnInvalidDate(date: any): any | undefined {
    return date instanceof Date && isNaN(date.getTime()) ? undefined : date;
  }
}

export function dateTimeToString(dateTime: Date): string {
  return dateTime.toISOString().substr(0, 16);
}

export function dateToString(date: Date): string {
  return date.toISOString().substr(0, 10);
}
