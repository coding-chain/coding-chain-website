import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-steps-test-edit-item',
  templateUrl: './steps-test-edit-item.component.html',
  styles: []
})
export class StepsTestEditItemComponent implements OnInit {

  @Input() test: ITestNavigation;
  @Output() testGrpReady = new EventEmitter<FormGroup>();

  _testGrp: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit(): void {
    this._testGrp = this._fb.group({});
    this.testGrpReady.emit(this._testGrp);
  }

}
