import {GramOrderEnum} from '../types/gram-order.enum';
import * as _ from 'lodash';
import {IObjectUpdateResume} from '../models/object-difference';


export class ObjectUtils {

  public static getNotEqualProperties<T>(source: T, other: T): (keyof T)[] {
    return _.reduce(source, (result, value, key) => {
      return _.isEqual(value, other[key]) ?
        result : result.concat(key);
    }, []);
  }

  public static getNotEqualsObjectsWith<T>(sources: T[], others: T[], uniqComparator: (src: T, other: T) => boolean)
    : IObjectUpdateResume<T>[] {
    return _.without(sources.map(source => {
        const sameObj = others.find(other => uniqComparator(other, source));
        if (!sameObj) {
          return;
        }
        const objDifference: IObjectUpdateResume<T> = {
          originalVersion: source,
          editedVersion: sameObj,
          differentProperties: ObjectUtils.getNotEqualProperties(source, sameObj)
        };
        if (!objDifference.differentProperties.length) {
          return;
        }
        return objDifference;
      }
    ), undefined);
  }

  public static getNotEqualsObjectWith<T>(source: T, other: T)
    : IObjectUpdateResume<T> | undefined {
    const objDifference: IObjectUpdateResume<T> = {
      originalVersion: source,
      editedVersion: other,
      differentProperties: ObjectUtils.getNotEqualProperties(source, other)
    };
    if (!objDifference.differentProperties.length) {
      return;
    }
    return objDifference;
  }

  public static setKeysTextBorder(obj: any, text: string, order: GramOrderEnum): any {
    if (!_.isObject(obj)) {
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
    if (!_.isString(obj)) {
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

  public static groupBy<T, K extends keyof T>(arr: T[], selector: (el: T) => T[K]): Map<T[K], T[]> {
    const grpObj = _.groupBy(arr, selector);
    const map = new Map<T[K], T[]>();
    Object.keys(grpObj).forEach((k: any) => {
      map.set(k, grpObj[k]);
    });
    return map;
  }

  private static isEmpty(obj: any): boolean {
    if (!_.isObject(obj)) {
      return true;
    }
    return Object.keys(obj).length === 0;
  }
}
