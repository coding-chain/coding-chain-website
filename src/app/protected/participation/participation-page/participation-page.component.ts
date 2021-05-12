import {Component, OnDestroy, OnInit} from '@angular/core';
import {LanguageService} from '../../../core/services/http/language.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-participation-page',
  templateUrl: './participation-page.component.html',
  styles: []
})
export class ParticipationPageComponent implements OnInit, OnDestroy {
  private _participationSub: Subscription;

  constructor(private readonly languageService: LanguageService) {
  }

  ngOnDestroy(): void {
    this._participationSub.unsubscribe();
  }

  ngOnInit(): void {
    var cursor = this.languageService.getCursor({page: 1, size: 10});
    this._participationSub = cursor.resultsSubject$.subscribe(res => console.log(res));
    cursor.current();
  }
}
