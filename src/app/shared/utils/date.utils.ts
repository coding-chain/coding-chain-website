export class DateUtils {
  static undefinedOnInvalidDate(date: any): any | undefined {
    return date instanceof Date && isNaN(date.getTime()) ? undefined : date;
  }

  static dateTimeToString(dateTime: Date): string {
    if (!dateTime) {
      return;
    }
    const tzOffset = dateTime.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(dateTime.getTime() - tzOffset)).toISOString().slice(0, -1);
    return localISOTime?.substr(0, 16);
  }

  static dateToString(date: Date): string {
    return date?.toISOString()?.substr(0, 10);
  }

  static toLocaleDate(dateText: string): Date {
    if (dateText.endsWith('Z')) {
      return new Date(dateText);
    }
    return new Date(dateText + 'Z');
  }

  static reformatDate(dateStr): string {
    const dArr = dateStr.split('-');
    return dArr[2] + '/' + dArr[1] + '/' + dArr[0].substring(2);
  }

}




