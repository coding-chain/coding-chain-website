import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {from, Observable, Subject, Subscription} from 'rxjs';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {ParticipationConnectedUser} from '../../../shared/models/users/connected-user';
import {ActivatedRoute, Router} from '@angular/router';
import {ParticipationSessionStateService} from '../../../core/services/states/participation-session-state.service';
import {ParticipationSessionService} from '../../../core/services/http/participation-session.service';
import {
  IUserSession,
  ParticipationSession,
  TournamentStepParticipation
} from '../../../shared/models/participations-session/participation-session';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import * as _ from 'lodash';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IPublicTestNavigation} from '../../../shared/models/tests/responses';
import {ITestSession} from '../../../shared/models/tests-session/test-session';
import {ParticipationService} from '../../../core/services/http/participation.service';
import Swal from 'sweetalert2';
import {SwalUtils} from '../../../shared/utils/swal.utils';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {ConfettiUtils} from '../../../shared/utils/confettiUtils';

@Component({
  selector: 'app-participation-page',
  templateUrl: './participation-page.component.html',
  styleUrls: ['./participation-page.component.scss']
})
export class ParticipationPageComponent implements OnInit, OnDestroy {
  public participation$ = new Subject<ParticipationSession>();
  public currentUser: ParticipationConnectedUser;
  public participation: ParticipationSession;
  public pipelineFunctions: AppFunction[];
  public tests: ITestSession[] = [];
  public theme: Theme;
  public stackFunctions: AppFunction[];
  public users: IUserSession[] = [];
  public formGrp: FormGroup;
  private _participationSub: Subscription;
  private connectedUserSub: Subscription;
  private disconnectedUserSub: Subscription;
  private userSub: Subscription;
  private addedFunctionsSub: Subscription;
  private updatedFunctionSub: Subscription;
  private removedFuncSub: Subscription;
  private updatedUserSub: Subscription;
  private reorderedFunctionsSub: Subscription;
  private processEndSub: Subscription;
  private processStartSub: Subscription;
  private readySub: Subscription;
  private scoreSub: Subscription;

  constructor(
    private readonly _participationSessionService: ParticipationSessionService,
    private readonly _participationStateService: ParticipationSessionStateService,
    private readonly _userStateService: UserStateService,
    private readonly _participationService: ParticipationService,
    private readonly _themeService: ThemeService,
    private readonly _changeDetection: ChangeDetectorRef,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _zone: NgZone,
    private readonly _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGrp = this._fb.group({});
    this._route.params.subscribe(params => {
      this.disconnect().subscribe(stopped => {
        this.initHubConnection(params.id);
      });
    });
    this._themeService.themeSubject$.subscribe(theme => {
      this.theme = theme;
      this.publishParticipation();
    });

    this._themeService.publishTheme();
  }

  publishParticipation(): void {
    if (this.theme && this.participation) {
      this.participation$.next(this.participation);
    }
  }

  ngOnDestroy(): void {
    this.disconnect().subscribe();
  }

  onStackFunctionAdded($func: AppFunction): void {
    this._participationSessionService.upsertFunc(this.participation.id, $func)
      .subscribe(res => console.log($func.id ? 'UPDATE' : 'ADD', $func));
  }

  onStackFunctionRemoved($func: AppFunction): void {
    this._participationSessionService.removeFunction(this.participation.id, $func.id)
      .subscribe(res => console.log('DELETE', $func));
  }

  onPipelineFunctionAdded($func: AppFunction): void {
    this._participationSessionService.updateFunction(this.participation.id, $func.id, $func)
      .subscribe(res => console.log('UPDATE', $func));
  }

  onStackFunctionUpdated($func: AppFunction): void {
    if (this.stackFunctions.some(f => $func.id === f.id)) {
      this._participationSessionService.updateFunction(this.participation.id, $func.id, {order: $func.order, code: $func.code})
        .subscribe();
    }
  }

  onElevatedUser($user: IUserSession): void {
    this._participationSessionService.elevateUser(this.participation.id, $user.id)
      .subscribe();
  }

  onExecute(): void {
    this._participationSessionService.startExecution(this.participation.id).subscribe();
  }

  onNextParticipation(participationStep: TournamentStepParticipation): void {
    if (participationStep.id) {
      this._router.navigate(['/participations', participationStep.id]);
    } else {
      this._participationService.createOneAndGetId({
        tournamentId: participationStep.tournamentId,
        stepId: participationStep.stepId,
        teamId: participationStep.teamId
      }).subscribe(participationId => {
        Swal.fire(SwalUtils.infoOptions('Participation créée pour l`\'étape suivante')).then(closed => {
          this._router.navigate(['/participations', participationId]);
        });
      });
    }
  }

  private disconnect(): Observable<any> {
    this.disconnectedUserSub?.unsubscribe();
    this.connectedUserSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.addedFunctionsSub?.unsubscribe();
    this.updatedFunctionSub?.unsubscribe();
    this._participationSub?.unsubscribe();
    this.removedFuncSub?.unsubscribe();
    this.processStartSub?.unsubscribe();
    this.processEndSub?.unsubscribe();
    this.readySub?.unsubscribe();
    this.scoreSub?.unsubscribe();
    return this._participationStateService.stopConnection();
  }

  private initHubConnection(participationId: string): void {
    this.listenConnectedUser();
    this.listenStartedExecution();
    this.listenEndedExecution();
    this.listenDisconnectedUser();
    this.listenReorderedFunctions();
    this.listenUpdatedUser();
    this.listenAddedFunction();
    this.listenUpdatedFunction();
    this.listenRemovedFunction();
    this.listenReadyParticipation();
    this.listenScoreParticipation();
    this.listenCurrentUser(participationId);
  }

  private listenCurrentUser(participationId: string): void {
    if (this.currentUser) {
      this.getParticipation(participationId);
      return;
    }
    this.userSub = this._userStateService.userSubject$.subscribe(user => {
      if (!this.currentUser) {
        this.currentUser = new ParticipationConnectedUser(user);
        this.getParticipation(participationId);
      }
    });
    this._userStateService.loadUser();
  }

  private listenDisconnectedUser(): void {
    this.disconnectedUserSub = this._participationStateService.disconnectedUser$.subscribe(userId => {
      _.remove(this.users, u => u.id === userId);
      this.users = [...this.users];
      this.currentUser.updateElevateRight(this.users);
    });
  }

  private listenUpdatedUser(): void {
    this.updatedUserSub = this._participationStateService.updatedConnectedUser$.subscribe(user => {
      const userForUpdate = this.users.find(u => u.id === user.id);
      if (userForUpdate) {
        userForUpdate.isAdmin = user.isAdmin;
      }
      this.currentUser.updateElevateRight(this.users);
    });
  }

  private listenEndedExecution(): void {
    this.processEndSub = this._participationStateService.processEnd$.subscribe(result => {
      this.participation.lastOutput = result.lastOutput;
      this.participation.lastError = result.lastError;
      this.participation.passedTestsIds = result.passedTestsIds;
      this.participation.processStartTime = result.processStartTime;
      this.participation.calculatedScore = result.score;
      this.showTournamentEndMessage(result.endDate);
      this.participation.endDate = result.endDate;
      this.tests = this.testsToTestSession(this.participation.step.tests, this.participation.passedTestsIds);
    });
  }

  private showTournamentEndMessage(endDate: Date): void {
    if (!this.participation.endDate && endDate && !this.participation.nextParticipationStep) {
      const closePromise = Swal.fire(SwalUtils.successOptions(`Féliciations vous avez terminé le tournoi !!`));
      ConfettiUtils.show(this._themeService.colorsArray, from(closePromise));
    }
  }

  private listenStartedExecution(): void {
    this.processStartSub = this._participationStateService.processStart$.subscribe(result => {
      this.participation.processStartTime = result.processStartTime;
    });
  }

  private listenConnectedUser(): void {
    this.connectedUserSub = this._participationStateService.connectedUser$.subscribe(user => {
      if (!user) {
        return;
      }
      this.users.push(user);
      this.users = [...this.users];
      this.currentUser.updateElevateRight(this.users);
    });
  }

  private getParticipation(participationId: string): void {
    this._participationSub = this._participationStateService.startConnection(participationId)
      .subscribe(participation => {
        this.participation = participation;
        this.users = participation.users;
        this.stackFunctions = participation.functions.filter(f => f.order == null);
        this.pipelineFunctions = participation.functions.filter(f => f.order > 0)
          .sort((f1, f2) => f1.order - f2.order);
        this.publishParticipation();
        this.currentUser.updateElevateRight(this.users);
        this.tests = this.testsToTestSession(this.participation.step.tests, this.participation.passedTestsIds);
      });
  }

  private testsToTestSession(tests: IPublicTestNavigation[], testsPassedIds: string[]): ITestSession[] {
    return tests.map(t => {
      let hasPassed = testsPassedIds.some(id => t.id === id);
      if (!this.participation.lastError && !this.participation.lastOutput) {
        hasPassed = undefined;
      }
      return {...t, hasPassed};
    });
  }

  private listenUpdatedFunction(): void {
    this.updatedFunctionSub = this._participationStateService.updatedFunction$.subscribe(func => {
      const existingFunc = [...this.pipelineFunctions, ...this.stackFunctions].find(f => f.id === func.id);
      if (func.order !== existingFunc.order) {
        if (existingFunc.order == null && func.order) {
          this.removeFromStack(existingFunc);
          this.addToPipeline(func);
        } else if (existingFunc.order && func.order == null) {
          this.removeFromPipeline(func);
          this.addToStack(func);
        }
      }
      if (existingFunc) {
        existingFunc.copy(func);
      }
    });
  }

  private removeFromStack(existingFunc: AppFunction): void {
    _.remove(this.stackFunctions, f => f.id === existingFunc.id);
    this.stackFunctions = [...this.stackFunctions];
  }

  private removeFromPipeline(func: AppFunction): void {
    _.remove(this.pipelineFunctions, f => f.id === func.id);
    this.sortPipeline();
  }

  private listenAddedFunction(): void {
    this.addedFunctionsSub = this._participationStateService.addedFunction$.subscribe(func => {
      this.participation.functions.push(func);
      this.stackFunctions.push(func);
      this.stackFunctions = [...this.stackFunctions];
    });
  }

  private listenReorderedFunctions(): void {
    this.reorderedFunctionsSub = this._participationStateService.reorderedFunctions$.subscribe(functions => {
      functions.forEach(f => {
        const existingFunc = this.pipelineFunctions.find(pF => pF.id === f.id);
        if (existingFunc) {
          existingFunc.order = f.order;
        }
      });
      this.sortPipeline();
    });
  }

  private listenReadyParticipation(): void {
    this.readySub = this._participationStateService.ready$.subscribe(event => {
      this.participation.isReady = event.isReady;
    });
  }

  private listenScoreParticipation(): void {
    this.scoreSub = this._participationStateService.score$.subscribe(event => {
      this.participation.calculatedScore = event.score;
    });
  }


  private listenRemovedFunction(): void {
    this.removedFuncSub = this._participationStateService.removedFunction$.subscribe(func => {
      let existingFunc = this.stackFunctions.find(f => f.id === func.functionId);
      if (existingFunc) {
        this.removeFromStack(existingFunc);
      }
      existingFunc = this.pipelineFunctions.find(f => f.id === func.functionId);
      if (existingFunc) {
        this.removeFromPipeline(existingFunc);
      }
    });
  }

  private addToPipeline(func: AppFunction): void {
    this.pipelineFunctions.push(func);
    this.sortPipeline();
  }

  private sortPipeline(): void {
    this.pipelineFunctions = [...this.pipelineFunctions.sort((f1, f2) => f1.order - f2.order)];
  }

  private addToStack(func: AppFunction): void {
    this.stackFunctions.push(func);
    this.stackFunctions = [...this.stackFunctions];
  }

}
