import {FormGroup} from '@angular/forms';

export interface ItemWithForm<T> {
  item: T;
  form: FormGroup;
}
