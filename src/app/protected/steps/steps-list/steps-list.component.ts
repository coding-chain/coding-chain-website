import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {StepService} from '../../../core/services/http/step.service';
import {IStepsFilter} from '../../../shared/models/steps/filters';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {GetParams} from '../../../shared/models/http/get.params';

@Component({
  selector: 'app-steps-list',
  templateUrl: './steps-list.component.html',
  styles: []
})
export class StepsListComponent implements OnInit, OnDestroy {

  languages$ = new BehaviorSubject<IProgrammingLanguageNavigation[]>([]);
  steps: IStepNavigation[];
  stepsCursor: PageCursor<IStepNavigation, IStepsFilter>;
  steps$ = new BehaviorSubject<IStepNavigation[]>([]);
  private languagesSubscription: Subscription;

  constructor(private readonly _languagesService: LanguageService, private readonly _stepsService: StepService) {
  }

  ngOnInit(): void {
    this.languagesSubscription = this._languagesService.getAll().subscribe(languages => {
      this.languages$.next(languages);
    });
    this.stepsCursor = this._stepsService.getNavigationCursor({});
    this.stepsCursor.resultsSubject$.subscribe(res => {
      this.steps = res;
      this.steps$.next(this.steps);
    });
    this.stepsCursor.current();
  }

  searchSteps($filter: GetParams<IStepNavigation, IStepsFilter>): void {
    this.stepsCursor.updateFilter($filter);
    this.stepsCursor.current();
  }

  ngOnDestroy(): void {
    this.languagesSubscription?.unsubscribe();
  }


}
