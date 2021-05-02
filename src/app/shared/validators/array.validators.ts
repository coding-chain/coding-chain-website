import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notInValidator<T>(values: T[], predicate: (a: T, b: T) => boolean): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return ctrl.dirty && values?.some(value => predicate(ctrl.value, value)) ? {notInError: true} : null;
  };
}

export function notEmpty<T>(values: T[]): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return values.length > 0 ? null : {notEmptyArrErr: true};
  };
}

export function notEmptyArr<T>(obj: T, propertyName: keyof T): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (Array.isArray(obj[propertyName])) {
      const array = obj[propertyName] as unknown as Array<any>;
      return array?.length === 0 ? {notEmptyArrErr: true} : null;
    }
    return null;
  };
}

export function notEmptyFormArray<T>(obj: T, propertyName: keyof T): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (obj[propertyName] instanceof FormArray) {
      const array = obj[propertyName] as unknown as FormArray;
      return array?.length === 0 ? {notEmptyFormArrErr: true} : null;
    }
    return null;
  };
}
