import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ParticipationSession, TournamentStepParticipation} from '../../../shared/models/participations-session/participation-session';
import {FormGroup} from '@angular/forms';
import {ParticipationConnectedUser} from '../../../shared/models/users/connected-user';
import {Subject} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-participation-actions',
  templateUrl: './participation-actions.component.html',
  styles: []
})
export class ParticipationActionsComponent implements OnInit {

  @Output() previousParticipation = new EventEmitter<TournamentStepParticipation>();
  @Output() nextParticipation = new EventEmitter<TournamentStepParticipation>();
  @Output() executeParticipation = new EventEmitter();

  @Input() participation: ParticipationSession;
  @Input() participationForm: FormGroup;
  @Input() connectedUser: ParticipationConnectedUser;
  public isValid$ = new Subject<boolean>();

  constructor() {
  }

  ngOnInit(): void {
    this.isValid$.next(this.participationForm.valid);
    this.participationForm.statusChanges.pipe(delay(100)).subscribe(res => {
      this.isValid$.next(this.participationForm.valid);
    });
  }

  previousParticipationClicked(): void {
    this.previousParticipation.emit(this.participation.previousParticipationStep);
  }

  executeClicked(): void {
    this.executeParticipation.emit();
  }

  nextParticipationClicked(): void {
    this.nextParticipation.emit(this.participation.nextParticipationStep);
  }

}
