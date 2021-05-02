import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function lengthValidator(...lengths: number[]): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (lengths.some(l => l === (ctrl.value?.length ?? 0))) {
      return null;
    }
    return {lengthValidatorError: true};
  };
}

export function betweenValidator(min: number, max: number): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (ctrl.value?.length >= min && ctrl.value?.length <= max) {
      return null;
    }
    return {betweenValidatorError: true};
  };
}
