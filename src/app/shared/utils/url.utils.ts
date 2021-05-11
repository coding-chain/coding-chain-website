import {KeyValue} from '@angular/common';
import {JsonUtils} from './json.utils';
import {QueryEnum} from '../enums/query.enum';
import {ObjectUtils} from './object.utils';
import {GramOrderEnum} from '../enums/gram-order.enum';
import * as Case from 'case';
import {GetParams} from "../models/http/get.params";

export class UrlUtils{

  static getFilterQueryFromObj<T>(obj: T): KeyValue<string, any>[]{
    let filterObj = ObjectUtils.setKeysTextBorder(obj, 'Filter', GramOrderEnum.SUFFIX);
    filterObj = ObjectUtils.changeKeysCase(filterObj, Case.camel);
    return UrlUtils.transformObjToParams(filterObj);
  }

  static getFilterQueryGetParams(obj: GetParams<any>): KeyValue<string, any>[]{
    return [
      {key: 'page', value: obj.page },
      {key: 'size', value: obj.size }
    ]
  }


  static getQueryArrayFromConstructor(ctr: any, queryType: QueryEnum = QueryEnum.FIELDS): KeyValue<string, any>[]{
    const fields = ObjectUtils.getPropertiesByType(ctr);
    return fields.map(f => ({key: `${queryType.toLowerCase()}[]`, value: f}));
  }



  static getQueryArrayFromPropertiesArray<P>(properties: (keyof P)[], queryType: QueryEnum = QueryEnum.FIELDS): KeyValue<string, any>[]{
    if (!properties) { return []; }
    return properties.map(f => ({key: `${queryType.toLowerCase()}[]`, value: f}));
  }

  static getUrlWithQueries(baseUrl: string, ...params: KeyValue<string, any>[]): URL {
    const url = new URL(baseUrl);
    params = this.convertKeyValueArrayEntry(params);
    params.forEach(param => {
      if (param.key.endsWith('[]')){
        url.searchParams.append(param.key,  JsonUtils.stringifyNonString(param.value));
      } else {
        if (param.value === null || param.value === undefined){
          url.searchParams.delete(param.key);
        } else {
          url.searchParams.set(param.key, JsonUtils.stringifyNonString(param.value));
        }
      }
    });
    return url;
  }

  static removeUrlQueries(url: string): string{
    const tmpUrl = new URL(url);
    tmpUrl.searchParams.forEach( k => tmpUrl.searchParams.delete(k));
    return tmpUrl.toString();
  }

  static transformObjToParams(obj: any): KeyValue<string, any>[]{
    const keyVals: KeyValue<string, any>[] = [];
    if (!obj) { return keyVals; }
    Object.keys(obj).forEach( k => {
      keyVals.push({
        key: k,
        value: obj[k]
      });
    });
    return  keyVals;
  }

  static convertKeyValueArrayEntry(keyVal: KeyValue<string, any>[]): KeyValue<string, any>[]{
    const resKeyVal: KeyValue<string, any>[] = [];
    keyVal.forEach(kV => {
      if (Array.isArray(kV.value)){
        kV.value.forEach(v => resKeyVal.push({key: `${kV.key}[]`, value: v}));
      } else {
        resKeyVal.push(kV);
      }
    });
    return resKeyVal;
  }

  static convertPathUrlToKeysValues(textUrl: string): KeyValue<string, number>[]{
    const url = new URL(textUrl);
    const keyValues: KeyValue<string, number>[] = [];
    const segments = url.pathname.split('/');
    for (let i = 0 ; i < segments.length - 1; i++){
      const id = Number(segments[i + 1]);
      if (!isNaN(id)){
        keyValues.push({key: segments[i], value: id});
      }
    }
    return keyValues;
  }
  static convertGetParamsToUrl<P, F = P>(params: GetParams<P, F>): string{
    return UrlUtils.getUrlWithQueries(params.url,
      ...UrlUtils.getFilterQueryGetParams(params),
      ...UrlUtils.getFilterQueryFromObj(params.filterObj),
      ...(params.filters ?? []),
      ...UrlUtils.getQueryArrayFromConstructor(params.fieldCtr, QueryEnum.FIELDS),
      ...UrlUtils.getQueryArrayFromPropertiesArray(params.fields, QueryEnum.FIELDS),
      ...UrlUtils.getQueryArrayFromConstructor(params.ascOrderColumnsCtr, QueryEnum.ASC_ORDER_COLUMNS),
      ...UrlUtils.getQueryArrayFromPropertiesArray(params.ascOrderColumns, QueryEnum.ASC_ORDER_COLUMNS),
      ...UrlUtils.getQueryArrayFromConstructor(params.descOrderCtr, QueryEnum.DESC_ORDER_COLUMNS),
      ...UrlUtils.getQueryArrayFromPropertiesArray(params.descOrderColumns, QueryEnum.DESC_ORDER_COLUMNS)
    ).toString();
  }

}
