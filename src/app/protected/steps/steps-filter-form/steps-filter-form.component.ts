import {Component, Input, OnInit} from '@angular/core';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {SortOrder} from '../../../shared/types/sort-order';
import {FormBuilder, FormControl} from '@angular/forms';
import {FilterBaseComponent} from '../../../shared/components-bases/filter-base.component';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {IStepsFilter} from '../../../shared/models/steps/filters';

@Component({
  selector: 'app-steps-filter-form',
  templateUrl: './steps-filter-form.component.html',
  styles: []
})
export class StepsFilterFormComponent extends FilterBaseComponent<IStepNavigation, IStepsFilter> implements OnInit {

  @Input() languages: IProgrammingLanguage[];

  @Input() nameOrder: SortOrder = 'desc';

  languageCtrl: FormControl;
  nameCtrl: FormControl;

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

  updateForm(): void {
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


