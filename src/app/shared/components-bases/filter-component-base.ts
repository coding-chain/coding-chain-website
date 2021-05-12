import {FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({template: ''})
export abstract class FilterComponentBase<T> {
  filterGrp: FormGroup;

  @Input()
  filter: T = {} as T;

  @Output()
  filterChanged = new EventEmitter<T>();

  @Output()
  filterIsReset = new EventEmitter<boolean>();

  abstract reset(): void;

  protected setFilterValue<K extends keyof T>(key: keyof T, val: T[K]) {
    this.filter[key] = val;
  }

}
