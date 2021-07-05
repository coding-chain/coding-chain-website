import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPublicUser} from '../../../shared/models/users/responses';
import {IRightNavigation} from '../../../shared/models/rights/responses';
import {FormBuilder, FormControl} from '@angular/forms';

@Component({
  selector: 'app-users-item',
  templateUrl: './users-item.component.html',
  styles: []
})
export class UsersItemComponent implements OnInit {

  @Input() user: IPublicUser;
  @Input() rights: IRightNavigation[];
  @Output() updated = new EventEmitter<IPublicUser>();
  @Output() deleted = new EventEmitter<boolean>();
  rightsCtrl: FormControl;

  constructor(private readonly fb: FormBuilder) {
  }

  get userRights(): IRightNavigation[] {
    return this.rights.filter(right => this.user.rightIds.some(id => id === right.id));
  }

  ngOnInit(): void {
    this.rightsCtrl = this.fb.control(null);
    this.rightsCtrl.valueChanges.subscribe((rights: IRightNavigation[]) => {
      this.user.rightIds = rights.map(r => r.id);
    });
  }


  onDeleteUserClicked(): void {
    this.deleted.emit(true);
  }

  onUserSaveClicked(): void {
    this.updated.emit(this.user);
  }
}
