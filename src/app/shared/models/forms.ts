import {FormGroup} from '@angular/forms';

export interface ItemWithForm<T> {
  item: T;
  form: FormGroup;
}
export interface CheckItem<T> {
  item: T;
  check: boolean;
}
