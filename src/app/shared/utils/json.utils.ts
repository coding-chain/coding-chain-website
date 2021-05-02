export class JsonUtils {
  public static stringifyNonString(val: any): string{
    if (typeof val !== 'string'){
      return JSON.stringify(val);
    }
    return val;
  }
}
