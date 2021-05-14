import {Component, Input, OnInit} from '@angular/core';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {SortOrder} from '../../../shared/types/sort-order';
import {FormBuilder, FormControl} from '@angular/forms';
import {FilterComponentBase} from '../../../shared/components-bases/filter-component-base';
import {GetParams} from '../../../shared/models/http/get.params';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {IStepsFilter} from '../../../shared/models/steps/filters';

@Component({
  selector: 'app-steps-filter-form',
  templateUrl: './steps-filter-form.component.html',
  styles: [
  ]
})
export class StepsFilterFormComponent extends FilterComponentBase<IStepNavigation, IStepsFilter> implements OnInit {

  @Input() languages: IProgrammingLanguageNavigation[];

  @Input() nameOrder: SortOrder = 'desc';

  languageCtrl: FormControl;
  nameCtrl: FormControl;
  isPublishedCtrl: FormControl;

  constructor(private fb: FormBuilder) {
    super();

  }

  reset(): void {
  }

  ngOnInit(): void {
    this.languageCtrl = this.fb.control(null);
    this.nameCtrl = this.fb.control(null);
    this.filterGrp = this.fb.group({
      languageId: this.languageCtrl,
      name: this.nameCtrl,
    });
  }

  updateForm() {
    this.filterChanged.emit({
      filterObj: {
        languageId: this.languageCtrl.value,
        isPublished: this.filter.filterObj.isPublished,
        name: this.nameCtrl.value,
        withoutIds: []
      },
      descOrderColumns: [this.nameOrder === 'desc' ? 'name' : undefined],
      ascOrderColumns: [this.nameOrder === 'asc' ? 'name' : undefined]
    });
  }
}


