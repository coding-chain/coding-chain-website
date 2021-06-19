import {Component, OnInit} from '@angular/core';
import {PlagiarismService} from '../../../core/services/http/plagiarism.service';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ISuspectFunction} from '../../../shared/models/plagiarism/responses';
import {ISuspectFunctionsFilter} from '../../../shared/models/plagiarism/filter';
import {Subject} from 'rxjs';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {GetParams} from '../../../shared/models/http/get.params';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-plagiarism-list',
  templateUrl: './plagiarism-list.component.html',
  styles: []
})
export class PlagiarismListComponent implements OnInit {

  public functionsCursor: PageCursor<ISuspectFunction, ISuspectFunctionsFilter>;
  languages$ = new Subject<IProgrammingLanguage[]>();
  languages: IProgrammingLanguage[];
  suspectFunctions$ = new Subject<ISuspectFunction[]>();
  theme$ = new Subject<Theme>();

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
    this.suspectFunctions$ = this.functionsCursor.resultsSubject$;
    this.theme$ = this.themeService.themeSubject$;
    this.functionsCursor.current();
  }

  updateFilter(filter: GetParams<ISuspectFunction, ISuspectFunctionsFilter>): void {
    this.functionsCursor.updateFilter(filter);
    this.functionsCursor.current();
  }
}
