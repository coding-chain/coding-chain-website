import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DateUtils} from '../utils/date.utils';

export function validateDateBetween(startCtrl: FormControl, endCtrl: FormControl): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    if (!startCtrl || !endCtrl) {
      return {noDateCtrl: true};
    }
    if (endCtrl.value && !startCtrl.value) {
      return {noStartDate: true};
    }
    const startDate = startCtrl.value ? new Date(startCtrl.value) : null;
    const endDate = endCtrl.value ? new Date(endCtrl.value) : null;
    if (startDate && endDate) {
      if (startDate.getTime() > endDate.getTime()) {
        return {startDateLower: true};
      }
    }
    return null;
  };
}

export function maxDate(date: Date): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const ctrlDate = ctrl.value ? new Date(ctrl.value) : null;
    return DateUtils.undefinedOnInvalidDate(ctrlDate) && ctrlDate.getTime() > date.getTime() ? {maxDateError: true} : null;
  };
}

export function minDate(date: Date): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const ctrlDate = ctrl.value ? new Date(ctrl.value) : null;
    return DateUtils.undefinedOnInvalidDate(ctrlDate) && ctrlDate.getTime() < date.getTime() ? {minDateError: true} : null;
  };
}
