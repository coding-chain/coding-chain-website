import {Component, Input, OnInit} from '@angular/core';
import {FilterComponentBase} from "../../../shared/components-bases/filter-component-base";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {Form, FormBuilder, FormControl} from "@angular/forms";
import {ITournamentsFilter} from "../../../shared/models/tournaments/filters";
import {GetParams} from "../../../shared/models/http/get.params";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {SortOrder} from "../../../shared/types/sort-order";
import {map} from "rxjs/operators";
import {ITournamentResume} from "../../../shared/models/tournaments/tournament-resume";

@Component({
  selector: 'app-tournaments-filter-form',
  templateUrl: './tournaments-filter-form.component.html',
  styles: []
})
export class TournamentsFilterFormComponent extends FilterComponentBase<GetParams<ITournamentResume, ITournamentsFilter>> implements OnInit {
  @Input() languageId: IProgrammingLanguageNavigation[];

  @Input() nameOrder: SortOrder = "desc";
  @Input() currentUserId: string;
  _languageCtrl: FormControl;
  _nameCtrl: FormControl;

  constructor(fb: FormBuilder) {
    super();
    this.filterGrp = fb.group({});
  }

  _inMyTeamCtrl: FormControl;

  set inMyTeamCtrl(ctrl: FormControl) {
    this._inMyTeamCtrl = ctrl;
    this.filterGrp.setControl('inMyTeam', ctrl)
  }

  set languagesCtrl(ctrl: FormControl) {
    this._languageCtrl = ctrl;
    this.filterGrp.setControl('languageId', ctrl);
  }

  set tournamentCtrl(ctrl: FormControl) {
    this._nameCtrl = ctrl;
    this.filterGrp.setControl('name', ctrl);
  }

  reset(): void {
  }

  ngOnInit(): void {
  }

  updateForm() {

    this.filterChanged.emit({
      filterObj: {
        languageId: this._languageCtrl.value,
        participantId: this._inMyTeamCtrl.value ? this.currentUserId : null,
        name: this._nameCtrl.value
      },
      descOrderColumns: [this.nameOrder === 'desc' ? 'name' : undefined],
      ascOrderColumns: [this.nameOrder === 'asc' ? 'name' : undefined]
    });
  }
}
