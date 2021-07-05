import {Component, Input, OnInit} from '@angular/core';
import {FilterBaseComponent} from '../../../shared/components-bases/filter-base.component';
import {ISuspectFunction} from '../../../shared/models/plagiarism/responses';
import {ISuspectFunctionsFilter} from '../../../shared/models/plagiarism/filter';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {IPublicUser} from '../../../shared/models/users/responses';
import {FormBuilder, FormControl} from '@angular/forms';
import {IRightNavigation} from '../../../shared/models/rights/responses';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styles: []
})
export class UsersFilterComponent extends FilterBaseComponent<IPublicUser, IUsersFilter> implements OnInit {
  emailCtrl: FormControl;
  usernameCtrl: FormControl;
  rightsCtrl: FormControl;
  @Input() rights: IRightNavigation[];


  constructor(private readonly fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.emailCtrl = this.fb.control(null);
    this.usernameCtrl = this.fb.control(null);
    this.rightsCtrl = this.fb.control(this.rights);
    this.filterGrp = this.fb.group({
      email: this.emailCtrl,
      username: this.usernameCtrl,
    });
  }

  reset(): void {
  }

  updateForm(): void {
    this.filterChanged.emit({
      filterObj: {
        username: this.usernameCtrl.value,
        email: this.emailCtrl.value,
        rightId: this.rightsCtrl.value.id
      }
    });
  }

}
