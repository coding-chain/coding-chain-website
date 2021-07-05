import {Component, Input, OnInit} from '@angular/core';
import {IStepSession} from '../../../shared/models/participations-session/participation-session';
import {Theme} from '../../../core/services/states/theme.service';

@Component({
  selector: 'app-participation-step',
  templateUrl: './participation-step.component.html',
  styles: []
})
export class ParticipationStepComponent implements OnInit {

  @Input() stepCnt: number;
  @Input() theme: Theme;
  @Input() step: IStepSession;

  constructor() {
  }

  ngOnInit(): void {

  }

}
