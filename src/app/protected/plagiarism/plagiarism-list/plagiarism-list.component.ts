import {Component, OnInit} from '@angular/core';
import {PlagiarismService} from '../../../core/services/http/plagiarism.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IPlagiarizedFunction, ISuspectFunction} from '../../../shared/models/plagiarism/responses';
import {ISuspectFunctionsFilter} from '../../../shared/models/plagiarism/filter';
import {BehaviorSubject, Subject} from 'rxjs';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {GetParams} from '../../../shared/models/http/get.params';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import {T} from '@angular/cdk/keycodes';
import {CheckItem} from '../../../shared/models/forms';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import Swal from 'sweetalert2';
import {ArrayUtils} from '../../../shared/utils/array.utils';

@Component({
  selector: 'app-plagiarism-list',
  templateUrl: './plagiarism-list.component.html',
  styles: []
})
export class PlagiarismListComponent implements OnInit {

  public functionsCursor: PageCursor<ISuspectFunction, ISuspectFunctionsFilter>;
  languages$ = new BehaviorSubject<IProgrammingLanguage[]>(null);
  languages: IProgrammingLanguage[];
  suspectFunctions$ = new Subject<ISuspectFunction[]>();
  theme$ = new BehaviorSubject<Theme>(null);
  theme: Theme;
  trackBy = ArrayUtils.trackById;

  constructor(private readonly plagiarismService: PlagiarismService,
              private readonly languageService: LanguageService,
              private readonly themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.languageService.getAll().subscribe(languages => {
      this.languages = languages;
      this.languages$.next(languages);
    });
    this.functionsCursor = this.plagiarismService.getSuspectFunctionsCursor();
    this.functionsCursor.resultsSubject$.subscribe(functions =>
      this.suspectFunctions$.next(functions)
    );
    this.themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
      this.theme$.next(theme);
    });
    this.functionsCursor.current();
    this.themeService.publishTheme();
  }

  updateFilter(filter: GetParams<ISuspectFunction, ISuspectFunctionsFilter>): void {
    this.functionsCursor.updateFilter(filter).current();
  }

  updateSuspectValidity(func: ISuspectFunction, plagiarizedFunctions: CheckItem<IPlagiarizedFunction>[]): void {
    this.plagiarismService.updateSuspectFunctionValidity(func.id, {
      plagiarizedFunctions: plagiarizedFunctions.map(f => ({plagiarizedFunctionId: f.item.id, isValid: !f.check}))
    }).subscribe(res => {
      Swal.fire(SwalUtils.successOptions('Avis validés'))
        .then(closed => this.functionsCursor.current());
    });
  }
}
