import {Component, Input, OnInit} from '@angular/core';
import {IPublicTestNavigation} from '../../../shared/models/tests/responses';
import {ITestSession} from '../../../shared/models/tests-session/test-session';

@Component({
  selector: 'app-participation-tests',
  templateUrl: './participation-tests.component.html',
  styles: [
  ]
})
export class ParticipationTestsComponent implements OnInit {

  @Input() tests: ITestSession[];

  constructor() { }

  ngOnInit(): void {
  }

}
