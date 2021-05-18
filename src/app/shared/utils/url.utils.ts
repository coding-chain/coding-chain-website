import {KeyValue} from '@angular/common';
import {JsonUtils} from './json.utils';
import {QueryEnum} from '../types/query.enum';
import {ObjectUtils} from './object.utils';
import {GramOrderEnum} from '../types/gram-order.enum';
import * as Case from 'case';
import {GetParams} from '../models/http/get.params';
import * as _ from 'lodash';

export class UrlUtils {

  static getQueryFromObj<T>(obj: T, suffix: QueryEnum): KeyValue<string, any>[] {
    let filterObj = ObjectUtils.setKeysTextBorder(obj, suffix, GramOrderEnum.SUFFIX);
    filterObj = _(filterObj).omit(_.isUndefined).omit(_.isNull).value();
    filterObj = ObjectUtils.changeKeysCase(filterObj, Case.camel);
    return UrlUtils.transformObjToParams(filterObj);
  }

  static getQueryFromArr<T>(arr: T[], suffix: string, order: QueryEnum): KeyValue<string, any>[] {

    return _.compact(arr)?.map(col => ({key: Case.camel(`${col}${suffix}`), value: Case.camel(order)})) ?? [];
  }

  static getPagination(obj: GetParams<any>): KeyValue<string, any>[] {
    return [
      {key: Case.camel(QueryEnum.PAGE), value: obj.page},
      {key: Case.camel(QueryEnum.SIZE), value: obj.size}
    ];
  }

  static getUrlWithQueries(baseUrl: string, ...params: KeyValue<string, any>[]): URL {
    const url = new URL(baseUrl);
    params = this.convertKeyValueArrayEntry(params);
    params.forEach(param => {
      if (param.value === null || param.value === undefined) {
        url.searchParams.delete(param.key);
      } else {
        url.searchParams.set(param.key, JsonUtils.stringifyNonString(param.value));
      }
    });
    return url;
  }


  static transformObjToParams(obj: any): KeyValue<string, any>[] {
    const keyVals: KeyValue<string, any>[] = [];
    if (!obj) {
      return keyVals;
    }
    Object.keys(obj).forEach(k => {
      keyVals.push({
        key: k,
        value: obj[k]
      });
    });
    return keyVals;
  }

  static convertKeyValueArrayEntry(keyVal: KeyValue<string, any>[]): KeyValue<string, any>[] {
    const resKeyVal: KeyValue<string, any>[] = [];
    keyVal.forEach(kV => {
      if (Array.isArray(kV.value)) {
        kV.value.forEach((v, i) => resKeyVal.push({key: `${kV.key}[${i}]`, value: v}));
      } else {
        resKeyVal.push(kV);
      }
    });
    return resKeyVal;
  }

  static convertPathUrlToKeysValues(textUrl: string): KeyValue<string, any>[] {
    const url = new URL(textUrl);
    const keyValues: KeyValue<string, any>[] = [];
    const segments = url.pathname.split('/');
    for (let i = 0; i < segments.length - 1; i++) {
      const id = segments[i + 1];
      keyValues.push({key: segments[i], value: id});
    }
    return keyValues;
  }

  static convertGetParamsToUrl<P, F = P>(params: GetParams<P, F>): string {
    return UrlUtils.getUrlWithQueries(params.url,
      ...UrlUtils.getPagination(params),
      ...UrlUtils.getQueryFromObj(params.filterObj, QueryEnum.FILTER),
      ...UrlUtils.getQueryFromArr<(keyof P | keyof F)>(params.ascOrderColumns, 'Order', QueryEnum.ASC_ORDER_COLUMNS),
      ...UrlUtils.getQueryFromArr<(keyof P | keyof F)>(params.descOrderColumns, 'Order', QueryEnum.DESC_ORDER_COLUMNS)
    ).toString();
  }

}
