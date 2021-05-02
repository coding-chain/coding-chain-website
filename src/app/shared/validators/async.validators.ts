import {Observable} from 'rxjs';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {map} from 'rxjs/operators';

export function genericAsyncValidator(observable: Observable<boolean>, errName: string = 'genericAsyncValidatorError'): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return observable.pipe(
      map(val => val ? null : {[errName]: true})
    );
  };
}
