import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function leCtrlValidator(comparedCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!comparedCtrl.value || !ctrl.value) {
      return null;
    }
    const comparedVal = comparedCtrl?.value;
    return ctrl.value <= comparedVal ? {leCtrlError: true} : null;
  };
}

export function geCtrlValidator(comparedCtrl: AbstractControl): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!comparedCtrl.value || !ctrl.value) {
      return null;
    }
    const comparedVal = comparedCtrl?.value;
    return ctrl.value >= comparedVal ? {geCtrlError: true} : null;
  };
}
