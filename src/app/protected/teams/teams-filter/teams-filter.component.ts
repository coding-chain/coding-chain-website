import {Component, Input, OnInit} from '@angular/core';
import {FilterBaseComponent} from '../../../shared/components-bases/filter-base.component';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {SortOrder} from '../../../shared/types/sort-order';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {FormBuilder, FormControl} from '@angular/forms';
import {ITeamNavigation} from '../../../shared/models/teams/responses';
import {ITeamFilter} from '../../../shared/models/teams/filters';

@Component({
  selector: 'app-teams-filter',
  templateUrl: './team-filter.component.html',
  styles: [
  ]
})

export class TeamsFilterComponent extends FilterBaseComponent<ITeamNavigation, ITeamFilter> implements OnInit {

  @Input() nameOrder: SortOrder = 'desc';
  @Input() currentUser: ConnectedUser;

  nameCtrl: FormControl;
  myTeamCtrl: FormControl;

  constructor(private fb: FormBuilder) {
    super();

  }

  reset(): void {
  }

  ngOnInit(): void {
    this.nameCtrl = this.fb.control(null);
    this.myTeamCtrl = this.fb.control(null);
    this.filterGrp = this.fb.group({
      myTeam: this.myTeamCtrl,
      name: this.nameCtrl,
    });
  }

  updateForm(): void {
    this.filterChanged.emit({
      filterObj: {
        memberId: this.myTeamCtrl.value ? this.currentUser.id : null,
        name: this.nameCtrl.value,
      },
      descOrderColumns: [this.nameOrder === 'desc' ? 'name' : undefined],
      ascOrderColumns: [this.nameOrder === 'asc' ? 'name' : undefined]
    });
  }
}

