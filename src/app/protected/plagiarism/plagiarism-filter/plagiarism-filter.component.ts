import {Component, Input, OnInit} from '@angular/core';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {SortOrder} from '../../../shared/types/sort-order';
import {FilterBaseComponent} from '../../../shared/components-bases/filter-base.component';
import {ISuspectFunction} from '../../../shared/models/plagiarism/responses';
import {ISuspectFunctionsFilter} from '../../../shared/models/plagiarism/filter';
import {FormBuilder, FormControl} from '@angular/forms';
import {validateDateBetween} from '../../../shared/validators/date.validators';

@Component({
  selector: 'app-plagiarism-filter',
  templateUrl: './plagiarism-filter.component.html',
  styles: []
})
export class PlagiarismFilterComponent extends FilterBaseComponent<ISuspectFunction, ISuspectFunctionsFilter> implements OnInit {
  @Input() languages: IProgrammingLanguage[];
  @Input() nameOrder: SortOrder = 'desc';

  lowerThanDateCtrl: FormControl;
  greaterThanDateCtrl?: FormControl;
  languageCtrl?: FormControl;

  constructor(private readonly _fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.languageCtrl = this._fb.control(null);
    this.lowerThanDateCtrl = this._fb.control(null);
    this.greaterThanDateCtrl = this._fb.control(null);

    this.filterGrp = this._fb.group({
      lowerThanDate: this.lowerThanDateCtrl,
      languageId: this.languageCtrl,
      greaterThanDate: this.greaterThanDateCtrl,
    }, {validators: validateDateBetween(this.lowerThanDateCtrl, this.greaterThanDateCtrl)});

  }

  reset(): void {
  }

  updateForm(): void {
    this.filterChanged.emit({
      filterObj: {
        languageId: this.languageCtrl.value,
        lowerThanDate: this.lowerThanDateCtrl.value,
        greaterThanDate: this.greaterThanDateCtrl.value
      }
    });
  }
}
