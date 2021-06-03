import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';
import {ArrayUtils} from '../../../shared/utils/array.utils';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {Theme} from '../../../core/services/states/theme.service';
import {ItemWithForm} from '../../../shared/models/forms';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';


@Component({
  selector: 'app-steps-edit-tests',
  templateUrl: './steps-edit-tests.component.html',
  styleUrls: []
})
export class StepsEditTestsComponent implements OnInit {

  @Input() testsArray: FormArray;
  @Input() cardCountBySlide = 1;
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
    this.testsMatrix = ArrayUtils.toMatrix(this._tests, this.cardCountBySlide);
    this.fillTestsArray();
    this.testsArray.setValidators(this.allTypeSameValidate());
    this.testsArray.valueChanges.subscribe(res => this.testsChange.emit(this._tests.map(testWithGrp => {
      const test = testWithGrp.item;
      return {
        id: test.id,
        stepId: test.stepId,
        score: test.score,
        name: test.name,
        outputValidator: test.outputFunc.editorCode,
        inputGenerator: test.inputFunc.editorCode
      };
    })));
    if (!this.readonly && this._tests.length === 0) {
      this.addTest();
    }
  }

  addTest(): void {
    const testWithGrp = this.toTestEditionGrp();
    this._tests.unshift(testWithGrp);
    this.testsMatrix = ArrayUtils.toMatrix(this._tests, this.cardCountBySlide);

    this.testsArray.insert(0, testWithGrp.form);
  }

  onTestDelete(rowIdx: number, colIdx: number): void {
    const idx = this.getTestIndex(rowIdx, colIdx);
    this._tests.splice(idx, 1);
    this.testsArray.removeAt(idx);
    this.testsMatrix = ArrayUtils.toMatrix(this._tests, this.cardCountBySlide);
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
    const inFunc = FunctionFactory.new({code: test?.inputGenerator, language: this.step.language.name, type: 'inGen'});
    const outFunc = FunctionFactory.new({code: test?.outputValidator, language: this.step.language.name, type: 'outVal'});
    return {
      language: this.step.language,
      stepId: this.step.stepId,
      score: 1,
      stepPublished: this.step.isPublished,
      inputFunc: inFunc.parse(),
      outputFunc: outFunc.parse(),
      ...test
    };
  }

  private toTestEditionGrp(test?: ITestNavigation): ItemWithForm<ITestEdition> {
    return {item: this.toTestEdition(test) as ITestEdition, form: this._fb.group({})};
  }


  private allTypeSameValidate(): ValidatorFn {
    return (ctrl: AbstractControl): ValidationErrors | null => {
      console.log(this._tests);
      this._tests.forEach(t => {
        t.item.inputFunc.parse();
        t.item.outputFunc.parse();
      });
      if (this._tests?.length) {
        const test = this._tests[0].item;
        const inGenOutType = test.inputFunc.outputType;
        const outFuncInGen = test.outputFunc.inputType;
        const allSameTypes = this._tests
          .every(t => t.item.inputFunc.outputType === inGenOutType && t.item.outputFunc.inputType === outFuncInGen);
        if (!allSameTypes) {
          console.log('ERROR', {allSameTypesErr: {in: inGenOutType, out: outFuncInGen}});
          return {allSameTypesErr: {in: inGenOutType, out: outFuncInGen}};
        }
      }
      return null;
    };
  }

}
