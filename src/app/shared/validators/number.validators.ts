import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

function prepareCtrls(sourceCtrl: AbstractControl, compareCtrl: AbstractControl, transformFunc: (value: any) => any = null): { sourceControlValue: any, compareCtrlValue: any } {
  let comparedVal = compareCtrl?.value;
  let ctrlVal = sourceCtrl.value;
  if (transformFunc) {
    comparedVal = transformFunc(compareCtrl?.value);
    ctrlVal = transformFunc(sourceCtrl.value);
  }
  return {sourceControlValue: ctrlVal, compareCtrlValue: comparedVal};
}

export function leCtrlValidator(comparedCtrl: AbstractControl, transformFunc: (value: any) => any = null): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value == null || ctrl.value == null) {
      return null;
    }
    const controls = prepareCtrls(ctrl, comparedCtrl, transformFunc);
    return controls.sourceControlValue <= controls.compareCtrlValue ? {leCtrlError: true} : null;
  };
}

export function ltCtrlValidator(comparedCtrl: AbstractControl, transformFunc: (value: any) => any = null): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value == null || ctrl.value == null) {
      return null;
    }
    const controls = prepareCtrls(ctrl, comparedCtrl, transformFunc);
    return controls.sourceControlValue < controls.compareCtrlValue ? {ltCtrlError: true} : null;
  };
}

export function geCtrlValidator(comparedCtrl: AbstractControl, transformFunc: (value: any) => any = null): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value == null || ctrl.value == null) {
      return null;
    }
    const controls = prepareCtrls(ctrl, comparedCtrl, transformFunc);
    return controls.sourceControlValue >= controls.compareCtrlValue ? {geCtrlError: true} : null;
  };
}

export function gtCtrlValidator(comparedCtrl: AbstractControl, transformFunc: (value: any) => any = null): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (comparedCtrl.value == null || ctrl.value == null) {
      return null;
    }
    const controls = prepareCtrls(ctrl, comparedCtrl, transformFunc);
    return controls.sourceControlValue > controls.compareCtrlValue ? {gtCtrlError: true} : null;
  };
}

