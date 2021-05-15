import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';
import {toMatrix} from '../../../shared/utils/array.utils';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {Theme} from '../../../core/services/theme.service';

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

  testsMatrix: ITestEdition[][] = [];
  private _tests: ITestEdition[];

  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._tests = this.step.tests.map(t => (this.toTestEdition(t) as ITestEdition));
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);
    this.testsArray = this._fb.array([]);
  }

  getTestForm(rowIdx: number, colIdx: number): FormGroup {
    const newTestGrp = this._fb.group({});
    if (this.testsMatrix[rowIdx][colIdx].stepPublished) {
      newTestGrp.disable();
    }
    this.testsArray.setControl(this.getTestIndex(rowIdx, colIdx), newTestGrp);
    return newTestGrp;
  }


  addTest(): void {
    this._tests.unshift(this.toTestEdition() as ITestEdition);
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);
  }

  onTestDelete(rowIdx: number, colIdx: number): void {
    this._tests.splice(this.getTestIndex(rowIdx, colIdx), 1);
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);

  }

  private toTestEdition(test?: ITestNavigation): Partial<ITestEdition> {
    return {language: this.step.language, stepId: this.step.stepId, score: 1, stepPublished: this.step.isPublished};
  }

  private getTestIndex(rowIdx: number, colIdx: number): number {
    return rowIdx * this.cardCountBySlide + colIdx;
  }
}
