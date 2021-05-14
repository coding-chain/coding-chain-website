import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {StepService} from '../../../core/services/http/step.service';
import {IStepsFilter} from '../../../shared/models/steps/filters';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {GetParams} from '../../../shared/models/http/get.params';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';

@Component({
  selector: 'app-steps-list',
  templateUrl: './steps-list.component.html',
  styles: []
})
export class StepsListComponent implements OnInit, OnDestroy {

  @Input() selectedStepsIds: string[] = [];
  @Input() languages: IProgrammingLanguageNavigation[];
  languages$ = new BehaviorSubject<IProgrammingLanguageNavigation[]>([]);
  private languagesSubscription: Subscription;
  steps: IStepNavigation[];
  stepsCursor: PageCursor<IStepNavigation, IStepsFilter>;
  steps$: BehaviorSubject<IStepNavigation[]>;

  constructor(private readonly _languagesService: LanguageService, private readonly _stepsService: StepService) {
  }

  ngOnInit(): void {
    if (!this.languages) {
      this.languagesSubscription = this._languagesService.getAll().subscribe(languages => {
        this.languages$.next(languages);
      });
    } else {
      this.languages$.next(this.languages);
    }

    this.stepsCursor = this._stepsService.getCursor({});
    this.steps$ = this.stepsCursor.resultsSubject$;
    this.stepsCursor.current();
  }

  searchSteps($filter: GetParams<IStepNavigation, IStepsFilter>) {
    $filter.filterObj.withoutIds = this.selectedStepsIds;
    this.stepsCursor.updateFilter($filter);
    this.stepsCursor.current();
  }

  ngOnDestroy(): void {
    this.languagesSubscription?.unsubscribe();
  }
}
