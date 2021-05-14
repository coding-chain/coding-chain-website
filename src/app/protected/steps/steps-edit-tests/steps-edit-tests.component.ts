import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';
import {toMatrix} from '../../../shared/utils/array.utils';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {ITestNavigation} from '../../../shared/models/tests/responses';

@Component({
  selector: 'app-steps-edit-tests',
  templateUrl: './steps-edit-tests.component.html',
  styleUrls: []
})
export class StepsEditTestsComponent implements OnInit {

  @Input() testsArray: FormArray;
  @Input() cardCountBySlide = 3;
  @Input() step: ITournamentEditionStep;

  testsMatrix: ITestEdition[][] = [];
  private _tests: ITestEdition[];
  constructor(private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    console.log(this.step);
    this._tests = this.step.tests.map(t => (this.toTestEdition(t) as ITestEdition));
    this.testsMatrix = toMatrix(this._tests, 3);
    this.testsArray = this._fb.array([]);
  }

  getTestForm(i: number, j: number): FormGroup {
    const newTestGrp = this._fb.group({});
    if (this.testsMatrix[i][j].stepPublished) {
      newTestGrp.disable();
    }
    this.testsArray.setControl(i, newTestGrp);
    return newTestGrp;
  }


  addTest() {
    this._tests.unshift(this.toTestEdition() as ITestEdition);
    this.testsMatrix = toMatrix(this._tests, this.cardCountBySlide);
  }

  private toTestEdition(test?: ITestNavigation ): Partial<ITestEdition>{
    return {language: this.step.language, stepId: this.step.stepId, score: 1, stepPublished: this.step.isPublished}
  }
}
