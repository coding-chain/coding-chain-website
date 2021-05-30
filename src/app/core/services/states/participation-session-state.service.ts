import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {from, Observable, of, Subject} from 'rxjs';
import {HubConnection} from '@microsoft/signalr/dist/esm/HubConnection';
import {HubConnectionBuilder} from '@microsoft/signalr';
import {AuthenticationService} from '../http/authentication.service';
import {switchMap, tap} from 'rxjs/operators';
import {
  IConnectedUserAddedEvent,
  IConnectedUserRemovedEvent,
  IParticipationFunctionAddedEvent,
  IParticipationFunctionRemovedEvent,
  IParticipationFunctionUpdatedEvent,
  IProcessEndEvent,
  IProcessStartEvent
} from '../../../shared/models/participations-session/events';
import {ParticipationSessionService} from '../http/participation-session.service';
import {AppFunction} from '../../../shared/models/function-session/responses';
import {IParticipationSession} from '../../../shared/models/participations-session/participation-session';


@Injectable({
  providedIn: 'root'
})
export class ParticipationSessionStateService {

  public connectedUser = new Subject<IConnectedUserAddedEvent>();
  public disconnectedUser = new Subject<IConnectedUserRemovedEvent>();
  public addedFunction = new Subject<AppFunction>();
  public removedFunction = new Subject<IParticipationFunctionRemovedEvent>();
  public updatedFunction = new Subject<AppFunction>();
  public processStart = new Subject<IProcessStartEvent>();
  public processEnd = new Subject<IProcessEndEvent>();
  private readonly connectionTimeout = environment.realTimeConnectionTimeout;
  private readonly onConnectedUserMethod = 'OnConnectedUser';
  private readonly onDisconnectedUserMethod = 'OnDisconnectedUser';
  private readonly onFunctionAdded = 'OnFunctionAdded';
  private readonly onFunctionRemoved = 'OnFunctionRemoved';
  private readonly onFunctionUpdated = 'OnFunctionUpdated';
  private readonly onProcessStart = 'OnProcessStart';
  private readonly onProcessEnd = 'OnProcessEnd';
  private hubUrl = `${environment.apiUrl}/participationsessionshub`;
  private hubConnection: HubConnection;
  private _participation: IParticipationSession;

  constructor(
    private readonly _authService: AuthenticationService,
    private readonly _participationSessionService: ParticipationSessionService) {
  }

  public startConnection(participationId: string): Observable<IParticipationSession> {
    let start$ = this._participationSessionService.getToken(participationId).pipe(
      switchMap(token => {
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
        this.listen();
        return this.connectedUser.asObservable().pipe(
          switchMap(connectedUser => this._participationSessionService.getParticipation(participationId))
        );
      }),
      tap(participation => this._participation = participation)
    );
    return start$;
  }

  public stopConnection(): Observable<void> {
    const stopConnection$ = from(this.hubConnection.stop());
    this.hubConnection = undefined;
    return stopConnection$;
  }

  private listen(): void {
    this.listenConnectedUser();
    this.listenDisconnectedUser();
    this.listenRemovedFunction();
    this.listenAddedFunction();
    this.listenUpdatedFunction();
    this.listenProcessStart();
    this.listenProcessEnd();
  }

  private listenConnectedUser(): void {
    this.hubConnection.on(this.onConnectedUserMethod, (event: IConnectedUserAddedEvent) => {
      this.connectedUser.next(event);
    });
  }

  private listenDisconnectedUser(): void {
    this.hubConnection.on(this.onDisconnectedUserMethod, (event: IConnectedUserRemovedEvent) => {
      this.disconnectedUser.next(event);
    });
  }

  private listenAddedFunction(): void {
    this.hubConnection.on(this.onFunctionAdded, (event: IParticipationFunctionAddedEvent) => {
      this._participationSessionService.getFunctionById(this._participation.id, event.functionId)
        .subscribe(func => this.addedFunction.next(
          AppFunction.new({...func, language: this._participation.step.language.name}).parse()
        ));
    });
  }

  private listenRemovedFunction(): void {
    this.hubConnection.on(this.onFunctionRemoved, (event: IParticipationFunctionRemovedEvent) => {
      this.removedFunction.next(event);
    });
  }

  private listenUpdatedFunction(): void {
    this.hubConnection.on(this.onFunctionUpdated, (event: IParticipationFunctionUpdatedEvent) => {
      this._participationSessionService.getFunctionById(this._participation.id, event.functionId)
        .subscribe(func => this.updatedFunction.next(
          AppFunction.new({...func, language: this._participation.step.language.name}).parse()
        ));
    });
  }

  private listenProcessStart(): void {
    this.hubConnection.on(this.onProcessStart, (event: IProcessStartEvent) => {
      this.processStart.next(event);
    });
  }

  private listenProcessEnd(): void {
    this.hubConnection.on(this.onProcessEnd, (event: IProcessEndEvent) => {
      this.processEnd.next(event);
    });
  }
}
