import {Component, Input, OnInit} from '@angular/core';
import {FilterBaseComponent} from '../../../shared/components-bases/filter-base.component';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {FormBuilder, FormControl} from '@angular/forms';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {SortOrder} from '../../../shared/types/sort-order';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';

@Component({
  selector: 'app-tournaments-filter-form',
  templateUrl: './tournaments-filter-form.component.html',
  styles: []
})
export class TournamentsFilterFormComponent extends FilterBaseComponent<ITournamentResume, ITournamentsFilter> implements OnInit {
  @Input() languages: IProgrammingLanguage[];

  @Input() nameOrder: SortOrder = 'desc';
  @Input() currentUserId: string;

  languageCtrl: FormControl;
  nameCtrl: FormControl;
  inMyTeamCtrl: FormControl;

  constructor(private fb: FormBuilder) {
    super();

  }

  reset(): void {
  }

  ngOnInit(): void {
    this.languageCtrl = this.fb.control(null);
    this.nameCtrl = this.fb.control(null);
    this.inMyTeamCtrl = this.fb.control(null);
    this.filterGrp = this.fb.group({
      inMyTeam: this.inMyTeamCtrl,
      languageId: this.languageCtrl,
      name: this.nameCtrl,
    });
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
