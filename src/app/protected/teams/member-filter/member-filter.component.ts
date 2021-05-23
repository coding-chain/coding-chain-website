import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {FilterBaseComponent} from '../../../shared/components-bases/filter-base.component';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {PublicUser} from '../../../shared/models/users/responses';

@Component({
  selector: 'app-member-filter',
  templateUrl: './member-filter.component.html',
  styles: []
})
export class MemberFilterComponent extends FilterBaseComponent<PublicUser, IUsersFilter> implements OnInit {

  usernameCtrl: FormControl;

  constructor(private readonly _fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.usernameCtrl = this._fb.control('');
  }

  reset(): void {
  }

  searchUsers(): void {
    this.filterChanged.emit({filterObj: {username: this.usernameCtrl.value}});
  }
}
