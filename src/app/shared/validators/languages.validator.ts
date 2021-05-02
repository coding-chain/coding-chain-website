import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {LanguageDto} from '../models/languages/language.dto';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';

export function isInLanguages(languages: Observable<LanguageDto[]>): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    return languages.pipe(
      map(languagesList => {
        const text: string = ctrl.value instanceof LanguageDto ? ctrl.value.displayCode : ctrl.value;
        return languagesList.filter(l => _.startsWith(l.displayCode.toLowerCase(), text.toLowerCase())).length > 0 ?
          null : {isInLanguagesErr: true};
      }));
  };
}

