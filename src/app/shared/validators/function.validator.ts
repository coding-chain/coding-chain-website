import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {AppFunction} from '../models/function-session/responses';

export function funcValidate(func: AppFunction): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    func.code = ctrl.value;
    return func.parse().isValid() ? null : {invalidFuncErr: true};
  };
}
