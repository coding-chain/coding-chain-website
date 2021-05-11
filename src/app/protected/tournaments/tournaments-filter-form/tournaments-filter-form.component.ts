import {Component, Input, OnInit} from '@angular/core';
import {FilterComponentBase} from "../../../shared/components-bases/filter-component-base";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {FormBuilder, FormControl} from "@angular/forms";
import {ITournamentsFilter} from "../../../shared/models/tournaments/filters";
import {GetParams} from "../../../shared/models/http/get.params";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {SortOrder} from "../../../shared/types/sort-order";

@Component({
  selector: 'app-tournaments-filter-form',
  templateUrl: './tournaments-filter-form.component.html',
  styles: [
  ]
})
export class TournamentsFilterFormComponent extends FilterComponentBase<GetParams<ITournamentNavigation, ITournamentsFilter>>  implements OnInit {
  @Input() languageId: IProgrammingLanguageNavigation[];
  set tournamentCtrl(ctrl: FormControl){
    this.filterGrp.setControl('name', ctrl);
  }
  @Input() nameOrder: SortOrder = "desc";

  reset(): void {
  }


  constructor(fb: FormBuilder) {
    super();
    this.filterGrp = fb.group({});
  }

  ngOnInit(): void {
  }
  set languagesCtrl(ctrl: FormControl){
    this.filterGrp.setControl('languageId', ctrl);
  }

  updateForm() {

    this.filterChanged.emit({
      filterObj: this.filterGrp.value,
      descOrderColumns: [ this.nameOrder === 'desc' ? 'name' : undefined ],
      ascOrderColumns: [ this.nameOrder === 'asc' ? 'name' : undefined ]
    });
  }
}
