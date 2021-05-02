import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DateUtils} from '../utils/date.utils';

export function validateDateBetween(startDateCtrlName: string, endDateCtrlName: string): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    const startDateCtrl = form.get(startDateCtrlName);
    const endDateCtrl = form.get(endDateCtrlName);
    if (!startDateCtrl || !endDateCtrl) {
      return {noDateCtrl: true};
    }
    if (endDateCtrl.value && !startDateCtrl.value) {
      return {noStartDate: true};
    }
    const startDate = startDateCtrl.value ? new Date(startDateCtrl.value) : null;
    const endDate = endDateCtrl.value ? new Date(endDateCtrl.value) : null;
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
