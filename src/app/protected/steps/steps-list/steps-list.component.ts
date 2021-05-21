import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {IProgrammingLanguage, IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {LanguageService} from '../../../core/services/http/language.service';
import {IStepNavigation, IStepResume} from '../../../shared/models/steps/responses';
import {StepService} from '../../../core/services/http/step.service';
import {IStepsFilter} from '../../../shared/models/steps/filters';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {GetParams} from '../../../shared/models/http/get.params';
import {FormBuilder} from '@angular/forms';
import * as _ from 'lodash';
import {ArrayUtils} from '../../../shared/utils/array.utils';
import {ObjectUtils} from '../../../shared/utils/object.utils';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';

@Component({
  selector: 'app-steps-list',
  templateUrl: './steps-list.component.html',
  styles: []
})
export class StepsListComponent implements OnInit, OnDestroy {

  languages$ = new BehaviorSubject<IProgrammingLanguageNavigation[]>([]);
  stepsCursor: PageCursor<IStepResume, IStepsFilter>;
  steps$ = new BehaviorSubject<IStepResume[]>([]);
  canCreate = true;
  trackById = ArrayUtils.trackById;
  private _steps: IStepResume[];
  private _languagesSubscription: Subscription;
  private _languages: IProgrammingLanguage[];

  constructor(
    private readonly _languagesService: LanguageService,
    private readonly _stepsService: StepService,
    private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._languagesSubscription = this._languagesService.getAll().subscribe(languages => {
      this.languages$.next(languages);
      this._languages = languages;
    });
    this.stepsCursor = this._stepsService.getResumeCursor({});
    this.stepsCursor.resultsSubject$.subscribe(steps => {
      this._steps = steps;
      this.steps$.next(_.cloneDeep(this._steps));
    });
    this.stepsCursor.current();
  }

  searchSteps($filter: GetParams<IStepNavigation, IStepsFilter>): void {
    this.stepsCursor.updateFilter($filter);
    this.stepsCursor.current();
  }

  ngOnDestroy(): void {
    this._languagesSubscription?.unsubscribe();
  }

  createStep(): void {
    this._steps.unshift({tests: [], language: this._languages[0]} as IStepResume);
    this.steps$.next(_.cloneDeep(this._steps));
    this.canCreate = false;
  }

  onStepDeleted(step: IStepResume): void {
    if (step?.id) {
      this._stepsService.deleteOne(step.id).subscribe(res => {
        const deleteIdx = this._steps.findIndex(s => s.id === step.id);
        this._steps.splice(deleteIdx, 1);
        this.steps$.next(_.cloneDeep(this._steps));
        Swal.fire(SwalUtils.successOptions('Etape supprimée'));
      });
    }
    this.steps$.next(_.cloneDeep(this._steps.slice(1)));
  }

  onStepSaved(step: IStepResume): void {
    if (!step.id) {
      this._stepsService.createOneResume(step).subscribe(createdStep => {
        this._steps[0] = createdStep;
        this.steps$.next(_.cloneDeep(this._steps));
        this.canCreate = true;
        Swal.fire(SwalUtils.successOptions('Etape créée'));
      });
      return;
    }
    const stepIdx = this._steps.findIndex(s => s.id === step.id);
    const stepDifferences = ObjectUtils.getNotEqualsObjectWith(this._steps[stepIdx], step);
    if (!stepDifferences) {
      return;
    }
    this._stepsService.updateStepWithComparisonAndGet(stepDifferences).subscribe(updatedStep => {
      this._steps[stepIdx] = updatedStep;
      this.steps$.next(_.cloneDeep(this._steps));
      Swal.fire(SwalUtils.successOptions('Etape mise à jour'));
    });
  }
}
