import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {AppFunction} from '../models/function-session/app-function';

export function funcValidate(func: AppFunction): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    func.code = ctrl.value;
    return func.parse().isValid() ? null : {invalidFuncErr: true};
  };
}

export function readonlyHeader(func: AppFunction): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (func.header && ctrl.value && !(ctrl.value as string).startsWith(func.header)) {
      return {readonlyHeaderError: true};
    }
  };
}
