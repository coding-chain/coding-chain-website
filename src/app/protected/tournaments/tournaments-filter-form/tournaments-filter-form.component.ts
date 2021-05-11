import {Component, Input, OnInit} from '@angular/core';
import {FilterComponentBase} from "../../../shared/components-bases/filter-component-base";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {FormBuilder, FormControl} from "@angular/forms";
import {ITournamentsFilter} from "../../../shared/models/tournaments/filters";

@Component({
  selector: 'app-tournaments-filter-form',
  templateUrl: './tournaments-filter-form.component.html',
  styles: [
  ]
})
export class TournamentsFilterFormComponent extends FilterComponentBase<ITournamentsFilter>  implements OnInit {
  @Input() languageId: IProgrammingLanguageNavigation[];
  set tournamentCtrl(ctrl: FormControl){
    this.filterGrp.setControl('name', ctrl);
  }

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
    this.filterChanged.emit(this.filterGrp.value);
  }
}
