import { Component, OnInit } from '@angular/core';
import {LanguageService} from "../../../core/services/http/language.service";

@Component({
  selector: 'app-participation-page',
  templateUrl: './participation-page.component.html',
  styles: [
  ]
})
export class ParticipationPageComponent implements OnInit {

  constructor(private readonly languageService: LanguageService) { }

  ngOnInit(): void {
    var cursor = this.languageService.getCursor({page: 1, size:10})
    cursor.resultsSubject.subscribe(res => console.log(res));
    cursor.current();
  }
}
