import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function eqValidator(val: any): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return ctrl.value !== val ? {eqValidatorErr: true} : null;
  };
}

export function eqCtrlValidator(otherCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return ctrl.value !== otherCtrl.value ? {eqValidatorErr: true} : null;
  };
}

export function eqCtrlsValidator(ctrls: AbstractControl[]): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return ctrls.every(subCtrl => subCtrl.value === ctrls[0].value) ? null : {eqValidatorErr: true};
  };
}

export function eqCtrlsIfExistsValidator(ctrls: AbstractControl[]): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const exists = ctrls.every(subCtrl => !!subCtrl.value);
    return exists ? ctrls.every(subCtrl => subCtrl.value === ctrls[0].value) ? null : {eqValidatorErr: true} : null;
  };
}

export function neValidator(val: any): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return ctrl.value === val ? {neValidatorErr: true} : null;
  };
}
