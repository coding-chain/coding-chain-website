import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {ParticipationService} from '../../../core/services/http/participation.service';
import {UserStateService} from '../../../core/services/states/user-state.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';
import {ActivatedRoute} from '@angular/router';
import {ParticipationSessionStateService} from '../../../core/services/states/participation-session-state.service';
import {ParticipationSessionService} from '../../../core/services/http/participation-session.service';
import {IParticipationSession} from '../../../shared/models/participations-session/participation-session';
import {AppFunction} from '../../../shared/models/function-session/responses';
import {Theme, ThemeService} from '../../../core/services/states/theme.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-participation-page',
  templateUrl: './participation-page.component.html',
  styleUrls: ['./participation-page.component.scss']
})
export class ParticipationPageComponent implements OnInit, OnDestroy {
  public participation$ = new Subject<IParticipationSession>();
  public currentUser: ConnectedUser;
  public participation: IParticipationSession;
  public pipelineFunctions: AppFunction[];
  public theme: Theme;
  public stackFunctions: AppFunction[];
  private _participationSub: Subscription;
  private connectedUserSub: Subscription;
  private disconnectedUserSub: Subscription;
  private userSub: Subscription;
  private addedFunctionsSub: Subscription;
  private updatedFunctionSub: Subscription;
  private removedFuncSub: Subscription;

  constructor(
    private readonly _participationService: ParticipationService,
    private readonly _participationSessionService: ParticipationSessionService,
    private readonly _participationStateService: ParticipationSessionStateService,
    private readonly _userStateService: UserStateService,
    private readonly _themeService: ThemeService,
    private readonly _changeDetection: ChangeDetectorRef,
    private readonly _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.initHubConnection(params.id);
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
    this._participationStateService.stopConnection().subscribe(res => {
      console.log('DISCONNECTED');
    });
    this.disconnectedUserSub.unsubscribe();
    this.connectedUserSub.unsubscribe();
    this.userSub.unsubscribe();
    this.addedFunctionsSub.unsubscribe();
    this.updatedFunctionSub.unsubscribe();
    this._participationSub.unsubscribe();
    this.removedFuncSub.unsubscribe();
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

  private initHubConnection(participationId: string): void {
    this.connectedUserSub = this._participationStateService.connectedUser.subscribe(user => console.log('CONNECTED USER', user));
    this.disconnectedUserSub = this._participationStateService.disconnectedUser.subscribe(user => console.log('DISCONNECTED USER', user));
    this.listenAddedFunction();
    this.listenUpdatedFunction();
    this.listenRemovedFunction();
    this.userSub = this._userStateService.userSubject$.subscribe(user => {
      if (!this.currentUser) {
        this.currentUser = user;
        this.getParticipation(participationId);
      }
    });
    this._userStateService.loadUser();
  }

  private getParticipation(participationId: string): void {
    this._participationSub = this._participationStateService.startConnection(participationId)
      .subscribe(participation => {
        this.participation = participation;
        this.stackFunctions = participation.functions.filter(f => f.order == null);
        this.pipelineFunctions = participation.functions.filter(f => f.order > 0)
          .sort((f1, f2) => f1.order - f2.order);
        this.publishParticipation();
        this._changeDetection.detectChanges();
      });
  }

  private listenUpdatedFunction(): void {
    this.updatedFunctionSub = this._participationStateService.updatedFunction.subscribe(func => {
      console.log('FUNCTIONS', this.participation.functions);
      console.log('FUNCTION', func);
      const existingFunc = [...this.pipelineFunctions, ...this.stackFunctions].find(f => f.id === func.id);
      if (func.order !== existingFunc.order) {
        if (existingFunc.order == null && func.order) {
          this.removeFromStack(existingFunc);
          this.addToPipeline(func);
        } else if (existingFunc.order && func.order == null) {
          this.removeFromPipeline(func);
          this.addToStack(func);
        } else if (existingFunc.order && func.order && existingFunc.order !== func.order) {
          existingFunc.order = func.order;
          this.pipelineFunctions = [...this.pipelineFunctions];
        }
      }
      if (existingFunc) {
        existingFunc.copy(func);
      }
      this._changeDetection.detectChanges();
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
    this.addedFunctionsSub = this._participationStateService.addedFunction.subscribe(func => {
      this.participation.functions.push(func);
      this.stackFunctions.push(func);
      this.stackFunctions = [...this.stackFunctions];
      this._changeDetection.detectChanges();
    });
  }

  private listenRemovedFunction(): void {
    this.removedFuncSub = this._participationStateService.removedFunction.subscribe(func => {
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
