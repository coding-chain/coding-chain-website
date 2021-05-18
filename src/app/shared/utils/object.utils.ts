import {GramOrderEnum} from '../types/gram-order.enum';
import * as _ from 'lodash';
import {IObjectUpdateResume} from '../models/object-difference';
import {IStepResume} from '../models/steps/responses';

export const isObject = (obj: any): boolean => {
  return !!obj && typeof obj === 'object';
};

export function getNotEqualProperties<T>(source: T, other: T): (keyof T)[] {
  return _.reduce(source, (result, value, key) => {
    return _.isEqual(value, other[key]) ?
      result : result.concat(key);
  }, []);
}

export function getNotEqualsObjectsWith<T>(sources: T[], others: T[], uniqComparator: (src: T, other: T) => boolean)
  : IObjectUpdateResume<T>[]{
    return _.without(sources.map(source => {
        const sameObj = others.find(other => uniqComparator(other, source));
        if (!sameObj) {
          return;
        }
        const objDifference: IObjectUpdateResume<T> = {
          originalVersion: source,
          editedVersion: sameObj,
          differentProperties: getNotEqualProperties(source, sameObj)
        };
        if (!objDifference.differentProperties.length) {
          return;
        }
        return objDifference;
      }
    ), undefined);
}

export class ObjectUtils {
  public static getPropertiesByType(ctr: any): string[] {
    if (!ctr) {
      return [];
    }
    try {
      const obj = new ctr();
      if (!obj) {
        return [];
      }
      return Object.getOwnPropertyNames(obj);
    } catch (e) {
      return [];
    }
  }

  public static getAnyValue(obj: any, key?: any): any {
    if (isObject(obj)) {
      return obj[key];
    } else {
      return obj;
    }
  }

  public static changePropertyValueIfDifferent<T, K extends keyof T>(key: keyof T, obj: T, value: T[K]): boolean {
    if (value !== obj[key]) {
      obj[key] = value;
      return true;
    }
    return false;
  }

  public static setKeysTextBorder(obj: any, text: string, order: GramOrderEnum): any {
    if (!isObject(obj)) {
      return obj;
    }

    const isArray = Array.isArray(obj);
    const newObj = isArray ? [] : {};

    Object.keys(obj).forEach(k => {
      const value = obj[k];
      if (!isArray) {
        if (order === GramOrderEnum.SUFFIX) {
          k = `${k}${text}`;
        } else {
          k = `${text}${k}`;
        }
      }
      newObj[k] = this.setKeysTextBorder(value, text, order);
    });
    return Object.keys(newObj).length === 0 ? obj : newObj;
  }

  public static changeKeysCase(obj: any, caseFunction: any): any {
    if (!isObject(obj)) {
      return obj;
    }
    const isArray = Array.isArray(obj);
    const newObj = isArray ? [] : {};
    Object.keys(obj).forEach(k => {
      const value = obj[k];
      if (!isArray) {
        k = caseFunction(k);
      }
      newObj[k] = this.changeKeysCase(value, caseFunction);
    });
    return this.isEmpty(obj) ? obj : newObj;
  }

  public static copyProperties<T>(src: any, dst: T): T {
    if (!isObject(src) || !isObject(dst)) {
      return dst;
    }
    Object.keys(dst).forEach(k => {
      if (src.hasOwnProperty(k)) {
        dst[k] = src[k];
      }
    });
    return dst;
  }

  public static tryGetEmptyConstructorObject<T>(ctr: any): T | undefined {
    try {
      return new ctr();
    } catch (e) {
      return;
    }
  }

  public static deepClone(obj: any): any {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return undefined;
    }
  }

  private static isEmpty(obj: any): boolean {
    if (!isObject(obj)) {
      return true;
    }
    return Object.keys(obj).length === 0;
  }
}
