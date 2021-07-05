import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';
export type validationErrors = 'notEmptyArrErr' ;

export function notEmpty<T>(values: T[]): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return values.length > 0 ? null : {['notEmptyArrErr']: true};
  };
}
export function notEmptyArr<T>(obj: T, propertyName: keyof T): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (Array.isArray(obj[propertyName])) {
      const array = obj[propertyName] as unknown as Array<any>;
      return array?.length === 0 ? {['notEmptyArrErr']: true} : null;
    }
    return null;
  };
}
