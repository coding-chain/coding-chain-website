import {Injectable, NgZone} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {from, Observable, of, Subject} from 'rxjs';
import {HubConnection} from '@microsoft/signalr/dist/esm/HubConnection';
import {HubConnectionBuilder} from '@microsoft/signalr';
import {AuthenticationService} from '../http/authentication.service';
import {switchMap, tap} from 'rxjs/operators';
import {
  IConnectedUserAddedEvent,
  IConnectedUserRemovedEvent,
  IConnectedUserUpdatedEvent,
  IParticipationFunctionAddedEvent,
  IParticipationFunctionRemovedEvent,
  IParticipationFunctionUpdatedEvent,
  IParticipationReadyEvent, IParticipationScoreChangedEvent,
  IProcessEndEvent,
  IProcessStartEvent,
  IReorderedFunctionsEvent
} from '../../../shared/models/participations-session/events';
import {ParticipationSessionService} from '../http/participation-session.service';
import {IFunctionSessionNavigation} from '../../../shared/models/function-session/responses';
import {
  IParticipationExecutionResult,
  IParticipationExecutionStart,
  IParticipationReadyResult, IParticipationScoreChangedResult,
  IUserSession,
  ParticipationSession
} from '../../../shared/models/participations-session/participation-session';
import {IUserSessionNavigation} from '../../../shared/models/user-session/responses';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';


@Injectable({
  providedIn: 'root'
})
export class ParticipationSessionStateService {

  public connectedUser$ = new Subject<IUserSession>();
  public disconnectedUser$ = new Subject<string>();
  public addedFunction$ = new Subject<AppFunction>();
  public removedFunction$ = new Subject<IParticipationFunctionRemovedEvent>();
  public updatedFunction$ = new Subject<AppFunction>();
  public reorderedFunctions$ = new Subject<AppFunction[]>();
  public updatedConnectedUser$ = new Subject<IUserSessionNavigation>();
  public processStart$ = new Subject<IParticipationExecutionStart>();
  public processEnd$ = new Subject<IParticipationExecutionResult>();
  public ready$ = new Subject<IParticipationReadyResult>();
  public score$ = new Subject<IParticipationScoreChangedResult>();
  private readonly connectionTimeout = environment.realTimeConnectionTimeout;
  private readonly onConnectedUserMethod = 'OnConnectedUser';
  private readonly onDisconnectedUserMethod = 'OnDisconnectedUser';
  private readonly onReady = 'OnReady';
  private readonly onFunctionAdded = 'OnFunctionAdded';
  private readonly onFunctionRemoved = 'OnFunctionRemoved';
  private readonly onFunctionUpdated = 'OnFunctionUpdated';
  private readonly onProcessStart = 'OnProcessStart';
  private readonly onProcessEnd = 'OnProcessEnd';
  private readonly onUpdatedConnectedUser = 'OnUpdatedConnectedUser';
  private readonly onFunctionsReordered = 'OnFunctionsReordered';
  private readonly onScoreChanged = 'OnScoreChanged';
  private hubUrl = `${environment.apiUrl}/participationsessionshub`;
  private hubConnection: HubConnection;
  private _participation: ParticipationSession;

  constructor(
    private readonly _authService: AuthenticationService,
    private readonly _zone: NgZone,
    private readonly _participationSessionService: ParticipationSessionService) {
  }

  public startConnection(participationId: string): Observable<ParticipationSession> {

    let start$ = this._participationSessionService.getToken(participationId).pipe(
      switchMap(token => {
        console.log('TOKEN', token);
        if (this.hubConnection) {
          return of(null);
        }
        this.hubConnection = new HubConnectionBuilder()
          .withUrl(this.hubUrl, {accessTokenFactory: () => token.token})
          .build();
        this.hubConnection.serverTimeoutInMilliseconds = this.connectionTimeout;
        return from(this.hubConnection.start());
      })
    );

    start$ = start$.pipe(
      switchMap(connected => {
        console.log('CONNECTED', connected);
        this.listen();
        return this.connectedUser$.asObservable().pipe(
          switchMap(connectedUser => {
            console.log('STATE CONNECTED USER', connectedUser);
            return this._participationSessionService.getParticipation(participationId);
          })
        );
      }),
      tap(participation => this._zone.run(() => this._participation = participation))
    );
    return new Observable<ParticipationSession>(subscriber => start$.subscribe(res => {
      this._zone.run(() => subscriber.next(res));
    }));
  }

  public stopConnection(): Observable<void> {
    this._participation = null;
    const stopConnection$ = from(this.hubConnection ? this.hubConnection.stop() : of(null));
    this.hubConnection = undefined;
    return stopConnection$;
  }

  private listen(): void {
    this.listenConnectedUser();
    this.listenDisconnectedUser();
    this.listenParticipationReady();
    this.listenParticipationScoreChanged();
    this.listenUpdatedUser();
    this.listenRemovedFunction();
    this.listenAddedFunction();
    this.listenUpdatedFunction();
    this.listenProcessStart();
    this.listenReorderedFunctions();
    this.listenProcessEnd();
  }

  private listenConnectedUser(): void {
    this.hubConnection.on(this.onConnectedUserMethod, (event: IConnectedUserAddedEvent) => {
      console.log('ON CONNECTED USER', event);
      if (!this._participation?.id) {
        console.log('INIT CONNECTED USER', event);
        this._zone.run(() => this.connectedUser$.next(null));
      }
      this._participationSessionService.getUserSession(this._participation.id, event.userId).subscribe(user => {
        this._zone.run(() => this.connectedUser$.next(user));
      });
    });
  }

  private listenDisconnectedUser(): void {
    this.hubConnection.on(this.onDisconnectedUserMethod, (event: IConnectedUserRemovedEvent) => {
      this._zone.run(() => this.disconnectedUser$.next(event.userId));
    });
  }

  private listenParticipationReady(): void {
    this.hubConnection.on(this.onReady, (event: IParticipationReadyEvent) => {
      this._participationSessionService.getSessionById(this._participation.id).subscribe(participation => {
        const isReady: IParticipationReadyResult = {
          isReady: participation.isReady,
        };
        this._zone.run(() => this.ready$.next(isReady));
      });
    });
  }

  private listenParticipationScoreChanged(): void {
    this.hubConnection.on(this.onScoreChanged, (event: IParticipationScoreChangedEvent) => {
      this._participationSessionService.getSessionById(this._participation.id).subscribe(participation => {
        const score: IParticipationScoreChangedResult = {
          score: participation.calculatedScore,
        };
        this._zone.run(() => this.score$.next(score));
      });
    });
  }

  private listenReorderedFunctions(): void {
    this.hubConnection.on(this.onFunctionsReordered, (event: IReorderedFunctionsEvent) => {
      this._participationSessionService.getFunctions(this._participation.id, event).subscribe(functions => {
        const reorderedFunctions = functions.map(f => this.toAppFunction(f));
        this._zone.run(() => this.reorderedFunctions$.next(reorderedFunctions));
      });
    });
  }


  private listenUpdatedUser(): void {
    this.hubConnection.on(this.onUpdatedConnectedUser, (event: IConnectedUserUpdatedEvent) => {
      this._participationSessionService.getUser(this._participation.id, event.userId)
        .subscribe(user => this._zone.run(() => this.updatedConnectedUser$.next(user)));
    });
  }

  private listenAddedFunction(): void {
    this.hubConnection.on(this.onFunctionAdded, (event: IParticipationFunctionAddedEvent) => {
      this._participationSessionService.getFunctionById(this._participation.id, event.functionId)
        .subscribe(func => {
          const addedFunction = this.toAppFunction(func);
          this._zone.run(() => this.addedFunction$.next(addedFunction));
        });
    });
  }


  private listenRemovedFunction(): void {
    this.hubConnection.on(this.onFunctionRemoved, (event: IParticipationFunctionRemovedEvent) => {
      this._zone.run(() => this.removedFunction$.next(event));
    });
  }

  private listenUpdatedFunction(): void {
    this.hubConnection.on(this.onFunctionUpdated, (event: IParticipationFunctionUpdatedEvent) => {
      this._participationSessionService.getFunctionById(this._participation.id, event.functionId)
        .subscribe(func => {
          const updatedFunc = this.toAppFunction(func);
          this._zone.run(() => this.updatedFunction$.next(updatedFunc));
        });
    });
  }

  private listenProcessStart(): void {
    this.hubConnection.on(this.onProcessStart, (event: IProcessStartEvent) => {
      this._participationSessionService.getSessionById(this._participation.id).subscribe(participation => {
        const executionStart: IParticipationExecutionStart = {
          processStartTime: participation.processStartTime,
        };
        this._zone.run(() => this.processStart$.next(executionStart));
      });
    });
  }

  private listenProcessEnd(): void {
    this.hubConnection.on(this.onProcessEnd, (event: IProcessEndEvent) => {
      this._participationSessionService.getSessionById(this._participation.id).subscribe(participation => {
        const executionResult: IParticipationExecutionResult = {
          processStartTime: participation.processStartTime,
          lastError: participation.lastError,
          lastOutput: participation.lastOutput,
          passedTestsIds: participation.passedTestsIds,
          endDate: participation.endDate,
          score: participation.calculatedScore
        };
        this._zone.run(() => this.processEnd$.next(executionResult));
      });
    });
  }

  private toAppFunction(func: IFunctionSessionNavigation): AppFunction {
    return FunctionFactory.new({
      ...func,
      language: this._participation.step.language.name,
      type: 'pipeline',
      header: this._participation.step.headerCode
    }).parse();
  }

}
