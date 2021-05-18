import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IStepNavigation, IStepResume} from '../../../shared/models/steps/responses';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IStepsFilter} from '../../../shared/models/steps/filters';
import {LanguageService} from '../../../core/services/http/language.service';
import {StepService} from '../../../core/services/http/step.service';
import {GetParams} from '../../../shared/models/http/get.params';
import {Theme, ThemeService} from '../../../core/services/theme.service';

interface IMovableStepNavigation extends IStepNavigation {
  canMove: boolean;
}

@Component({
  selector: 'app-steps-transfer',
  templateUrl: './steps-transfer.component.html',
  styleUrls: ['./steps-transfer.component.scss']
})
export class StepsTransferComponent implements OnInit {

  @Input() languages: IProgrammingLanguageNavigation[];

  @Output()
  selectedStepsChange = new EventEmitter<IStepNavigation[]>();
  searchedSteps: IMovableStepNavigation[];
  stepsCursor: PageCursor<IStepResume, IStepsFilter>;
  searchedSteps$ = new BehaviorSubject<IMovableStepNavigation[]>([]);
  theme$: Observable<Theme>;

  constructor(private readonly _languagesService: LanguageService,
              private readonly _stepsService: StepService,
              private readonly _themeService: ThemeService) {
  }

  _selectedSteps: IMovableStepNavigation[];

  get selectedSteps(): IStepNavigation[] {
    return this._selectedSteps;
  }

  @Input()
  set selectedSteps(steps: IStepNavigation[]) {
    this._selectedSteps = steps.map(s => ({canMove: false, ...s}));
    this._selectedSteps.forEach(s => s.canMove = false);
  }

  get selectedStepsIds(): string[] {
    return this.selectedSteps.map(s => s.id).filter(id => !!id);
  }


  ngOnInit(): void {
    this.stepsCursor = this._stepsService.getResumeCursor({});
    this.stepsCursor.availableSizes = [5, 10];
    this.stepsCursor.resultsSubject$.subscribe(steps => {
      this.searchedSteps = steps.map(step => ({canMove: true, ...step}));
      this.searchedSteps$.next(this.searchedSteps);
    });
    this.theme$ = this._themeService.themeSubject$;
    this._themeService.publishTheme();
  }

  searchSteps($filter: GetParams<IStepNavigation, IStepsFilter>): void {
    $filter.filterObj.withoutIds = this.selectedStepsIds;
    this.stepsCursor.updateFilter($filter);
    this.stepsCursor.current();
  }

  drop(event: CdkDragDrop<IMovableStepNavigation[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.selectedStepsChange.emit(this._selectedSteps);
  }
}
