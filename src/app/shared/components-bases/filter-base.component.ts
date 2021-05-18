import {FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetParams} from '../models/http/get.params';

@Component({template: ''})
export abstract class FilterBaseComponent<T, F = T> {
  filterGrp: FormGroup;

  @Input()
  filter: GetParams<T, F> = {filterObj: {}, descOrderColumns: [], ascOrderColumns: []} as GetParams<T, F>;

  @Output()
  filterChanged = new EventEmitter<GetParams<T, F>>();

  @Output()
  filterIsReset = new EventEmitter<boolean>();

  abstract reset(): void;

  protected setFilterValue<K extends keyof F>(key: keyof F, val: F[K]): void {
    this.filter.filterObj[key] = val;
  }

}
