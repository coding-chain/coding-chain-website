import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ITestEdition} from '../../../shared/models/tests/test-edition';

@Component({
  selector: 'app-steps-test-edit-item',
  templateUrl: './steps-test-edit-item.component.html',
  styles: []
})
export class StepsTestEditItemComponent implements OnInit {

  @Input() test: ITestEdition;

  @Input() testGrp: FormGroup;
  scoreCtrl: FormControl;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.scoreCtrl = this._fb.control(this.test.score, [Validators.min(0)]);
    this.testGrp.setControl('score', this.scoreCtrl);
  }

}
