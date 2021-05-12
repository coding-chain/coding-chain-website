import {Component, Input, OnInit} from '@angular/core';
import {FilterComponentBase} from '../../../shared/components-bases/filter-component-base';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {FormBuilder, FormControl} from '@angular/forms';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {GetParams} from '../../../shared/models/http/get.params';
import {SortOrder} from '../../../shared/types/sort-order';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';

@Component({
  selector: 'app-tournaments-filter-form',
  templateUrl: './tournaments-filter-form.component.html',
  styles: []
})
export class TournamentsFilterFormComponent extends FilterComponentBase<GetParams<ITournamentResume, ITournamentsFilter>> implements OnInit {
  @Input() languages: IProgrammingLanguageNavigation[];

  @Input() nameOrder: SortOrder = 'desc';
  @Input() currentUserId: string;

  languageCtrl: FormControl;
  nameCtrl: FormControl;
  inMyTeamCtrl: FormControl;

  constructor(fb: FormBuilder) {
    super();
    this.languageCtrl = fb.control(null);
    this.nameCtrl = fb.control(null);
    this.inMyTeamCtrl = fb.control(null);
    this.filterGrp = fb.group({
      inMyTeam: this.inMyTeamCtrl,
      languageId: this.languageCtrl,
      name: this.nameCtrl,
    });
  }

  reset(): void {
  }

  ngOnInit(): void {
  }

  updateForm() {
    this.filterChanged.emit({
      filterObj: {
        languageId: this.languageCtrl.value,
        participantId: this.inMyTeamCtrl.value ? this.currentUserId : null,
        name: this.nameCtrl.value
      },
      descOrderColumns: [this.nameOrder === 'desc' ? 'name' : undefined],
      ascOrderColumns: [this.nameOrder === 'asc' ? 'name' : undefined]
    });
  }
}
