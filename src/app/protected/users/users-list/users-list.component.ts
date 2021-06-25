import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/http/user.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IPublicUser} from '../../../shared/models/users/responses';
import {IUsersFilter} from '../../../shared/models/users/filters';
import {RightService} from '../../../core/services/http/right.service';
import {Subject} from 'rxjs';
import {IRightNavigation} from '../../../shared/models/rights/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {ArrayUtils} from '../../../shared/utils/array.utils';
import _ from 'lodash';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styles: []
})
export class UsersListComponent implements OnInit {

  cursor: PageCursor<IPublicUser, IUsersFilter>;
  users: IPublicUser[];
  rights$ = new Subject<IRightNavigation[]>();
  rights: IRightNavigation[] = [];
  trackBy = ArrayUtils.trackById;
  availableRights: IRightNavigation[];
  userRight: IRightNavigation;

  constructor(private readonly usersService: UserService, private readonly rightsService: RightService) {
  }

  ngOnInit(): void {
    this.cursor = this.usersService.getPublicUsersCursor();
    this.rightsService.getAll().subscribe(rights => {
      this.rights = rights;
      this.userRight = rights.find(r => r.name.toLowerCase() === 'user');
      this.availableRights = this.rights.filter(r => r.name.toLowerCase() !== 'user');
      this.rights$.next(rights);
    });
    this.cursor.resultsSubject$.subscribe(users => {
      this.users = _.cloneDeep(users);
    });
    this.cursor.current();

  }

  updateFilter($event: GetParams<IPublicUser, IUsersFilter>): void {
    this.cursor.updateFilter($event).current();
  }

  onUserDeleted(user: IPublicUser): void {
    this.usersService.deleteOneById(user.id).subscribe(res => {
      this.cursor.current();
      Swal.fire(SwalUtils.successOptions(`Utilisateur ${user.username} supprimé`));
    }, err => Swal.fire(SwalUtils.errorOptions(`Impossible de supprimer l'utilisateur ${user.username}`)));
  }

  onUserUpdated(user: IPublicUser): void {
    if (!user.rightIds.find(id => id === this.userRight.id)) {
      user.rightIds.push(this.userRight.id);
    }
    this.usersService.updateRights(user.id, {rightsIds: user.rightIds})?.subscribe(res => {
      Swal.fire(SwalUtils.successOptions(`Droits de l'utilisateur ${user.username} modifiés`));
    }, err => Swal.fire(SwalUtils.errorOptions(`Impossible de modifier les droits de l'utilisateur ${user.username}`)));
  }
}
