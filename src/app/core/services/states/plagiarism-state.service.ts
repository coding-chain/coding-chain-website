import {Injectable, NgZone} from '@angular/core';
import {AuthenticationService} from '../http/authentication.service';
import {from, Observable, of, Subject} from 'rxjs';
import {HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {HubConnection} from '@microsoft/signalr/dist/esm/HubConnection';
import {environment} from '../../../../environments/environment';
import {UserStateService} from './user-state.service';
import {ConnectedUser} from '../../../shared/models/users/connected-user';

@Injectable({
  providedIn: 'root'
})
export class PlagiarismStateService {
  public plagiarismAnalyseReady$ = new Subject<any>();
  private hubConnection: HubConnection;
  private hubUrl = `${environment.apiUrl}/plagiarismshub`;
  private readonly connectionTimeout = environment.realTimeConnectionTimeout;
  private readonly onPlagiarismAnalyseReady = 'OnPlagiarismAnalyseReady';

  constructor(private readonly _authService: AuthenticationService,
              private readonly _userStateService: UserStateService,
              private readonly _zone: NgZone) {
    this.listenUserChange();
  }

  public get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  public startConnection(): Observable<any> {
    if (this.hubConnection) {
      return of(null);
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {accessTokenFactory: () => this._authService.getToken()})
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = this.connectionTimeout;
    this._userStateService.userSubject$.subscribe(user => {
      if (user == null) {
        this.stopConnection().subscribe();
      }
    });
    return from(this.hubConnection.start());
  }


  public stopConnection(): Observable<void> {
    const stopConnection$ = from(this.hubConnection ? this.hubConnection.stop() : of(null));
    this.hubConnection = undefined;
    return stopConnection$;
  }

  public listenPlagiarismAnalyzeReady(): void {
    this.hubConnection.on(this.onPlagiarismAnalyseReady, _ => {
      this._zone.run(() => this.plagiarismAnalyseReady$.next(null));
    });
  }

  private listenUserChange(): void {
    this._userStateService.userSubject$.subscribe(user => {
      this.switchConnectionByUser(user);
    });
  }


  private switchConnectionByUser(user: ConnectedUser): void {
    if (!user?.isAdmin()) {
      this.stopConnection().subscribe();
    } else {
      this.startConnection().subscribe(_ => {
        this.listenPlagiarismAnalyzeReady();
      });
    }
  }
}
