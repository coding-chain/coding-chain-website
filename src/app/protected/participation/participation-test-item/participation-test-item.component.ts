import {Component, Input, OnInit} from '@angular/core';
import {IPublicTestNavigation} from '../../../shared/models/tests/responses';
import {ITestSession} from '../../../shared/models/tests-session/test-session';

@Component({
  selector: 'app-participation-test-item',
  templateUrl: './participation-test-item.component.html',
  styles: []
})
export class ParticipationTestItemComponent implements OnInit {

  @Input() test: ITestSession;

  constructor() {
  }

  ngOnInit(): void {
  }

}
