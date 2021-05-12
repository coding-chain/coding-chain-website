import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function leCtrlValidator(comparedCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value ==null || ctrl.value == null) {
      return null;
    }
    const comparedVal = comparedCtrl?.value;
    return ctrl.value <= comparedVal ? {leCtrlError: true} : null;
  };
}

export function ltCtrlValidator(comparedCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value ==null  || ctrl.value == null ) {
      return null;
    }
    const comparedVal = comparedCtrl?.value;
    return ctrl.value < comparedVal ? {ltCtrlError: true} : null;
  };
}

export function geCtrlValidator(comparedCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value ==null || ctrl.value == null) {
      return null;
    }
    const comparedVal = comparedCtrl?.value;
    return ctrl.value >= comparedVal ? {geCtrlError: true} : null;
  };
}
export function gtCtrlValidator(comparedCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value ==null || ctrl.value == null) {
      return null;
    }
    const comparedVal = comparedCtrl?.value;
    return ctrl.value > comparedVal ? {gtCtrlError: true} : null;
  };
}

