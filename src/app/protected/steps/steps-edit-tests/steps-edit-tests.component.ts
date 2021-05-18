import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';
import {toMatrix} from '../../../shared/utils/array.utils';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {Theme} from '../../../core/services/theme.service';
import {ItemWithForm} from '../../../shared/models/forms/item-with-form';


@Component({
  selector: 'app-steps-edit-tests',
  templateUrl: './steps-edit-tests.component.html',
  styleUrls: []
})
export class StepsEditTestsComponent implements OnInit {

  @Input() testsArray: FormArray;
  @Input() cardCountBySlide = 2;
  @Input() step: ITournamentEditionStep;
  @Input() theme: Theme;
  @Input() readonly = true;
  @Output() testsChange = new EventEmitter<ITestNavigation[]>();

  slides: number[];
  testsMatrix: ItemWithForm<ITestEdition>[][] = [];
  _tests: ItemWithForm<ITestEdition>[];

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._tests = this.step.tests.map(t => this.toTestEditionGrp(t));
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);
    this.fillTestsArray();
    this.testsArray.valueChanges.subscribe(res => this.testsChange.emit(this._tests.map(testWithGrp => {
      const test = testWithGrp.item;
      return {
        id: test.id,
        stepId: test.stepId,
        score: test.score,
        outputValidator: test.outputValidator,
        inputGenerator: test.inputGenerator
      };
    })));
    if (!this.readonly && this._tests.length === 0) {
      this.addTest();
    }
  }

  addTest(): void {
    const testWithGrp = this.toTestEditionGrp();
    this._tests.unshift(testWithGrp);
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);

    this.testsArray.insert(0, testWithGrp.form);
  }

  onTestDelete(rowIdx: number, colIdx: number): void {
    const idx = this.getTestIndex(rowIdx, colIdx);
    this._tests.splice(idx, 1);
    this.testsArray.removeAt(idx);
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);
  }

  getTestIndex(rowIdx: number, colIdx: number): number {
    return rowIdx * this.cardCountBySlide + colIdx;
  }

  private fillTestsArray(): void {
    this._tests.forEach((t, i) => {
      this.testsArray.setControl(i, t.form);
    });
  }

  private toTestEdition(test?: ITestNavigation): Partial<ITestEdition> {
    return {language: this.step.language, stepId: this.step.stepId, score: 1, stepPublished: this.step.isPublished, ...test};
  }

  private toTestEditionGrp(test?: ITestNavigation): ItemWithForm<ITestEdition> {
    return {item: this.toTestEdition(test) as ITestEdition, form: this._fb.group({})};
  }
}
