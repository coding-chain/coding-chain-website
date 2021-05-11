import {FormGroup} from '@angular/forms';
import {EventEmitter, Input, Output} from '@angular/core';

export abstract class FilterComponentBase<T> {
  filterGrp: FormGroup;

  @Input()
  filter: T = {} as T;

  @Output()
  filterChanged = new EventEmitter<T>();

  @Output()
  filterIsReset = new EventEmitter<boolean>();

  protected setFilterValue<K extends keyof T>(key: keyof T , val: T[K]){
    this.filter[key] = val;
  }

  abstract reset(): void;

}