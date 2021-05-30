import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Token} from '../../../shared/models/users/responses';
import {AuthenticationService} from './authentication.service';
import {map, switchMap} from 'rxjs/operators';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {ApiHelperService} from './api-helper.service';
import {IUserSessionNavigation} from '../../../shared/models/user-session/responses';
import {AppFunction, IFunctionSessionNavigation} from '../../../shared/models/function-session/responses';
import {IParticipationSessionNavigation} from '../../../shared/models/participations-session/responses';
import {IAddFunctionSessionCommand, IUpdateFunctionSessionCommand} from '../../../shared/models/function-session/commands';
import {StepService} from './step.service';
import {IParticipationSession, IUserSession} from '../../../shared/models/participations-session/participation-session';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipationSessionService extends ApiHelperService {

  protected apiUrl = `${environment.apiUrl}/participationsessions`;

  constructor(http: HttpClient,
              private readonly _authService: AuthenticationService,
              private readonly _stepService: StepService,
              private readonly _userService: UserService) {
    super(http);
  }


  public getFunctionById(participationId: string, functionId: string): Observable<IFunctionSessionNavigation> {
    return this.http.get<HateoasResponse<IFunctionSessionNavigation>>(`${this.apiUrl}/${participationId}/functions/${functionId}`).pipe(
      map(f => f.result)
    );
  }

  public getFunctions(participationId: string): Observable<IFunctionSessionNavigation[]> {
    return this.fetchAll<IFunctionSessionNavigation>({url: `${this.apiUrl}/${participationId}/functions`}).pipe(
      map(functions => functions.map(f => f.result))
    );
  }

  public getSessionById(participationId: string): Observable<IParticipationSessionNavigation> {
    return this.http.get<HateoasResponse<IParticipationSessionNavigation>>(`${this.apiUrl}/${participationId}`).pipe(
      map(res => res.result)
    );
  }

  public addFunction(participationId: string, body: IAddFunctionSessionCommand): Observable<string> {
    return this.createAndGetIds(`${this.apiUrl}/${participationId}/functions`, body)
      .pipe(
        map(ids => ids.pop())
      );
  }

  public upsertFunc(participationId: string, func: AppFunction): Observable<any> {
    if (!func.id) {
      return this.addFunction(participationId, {code: func.code, order: func.order});
    }
    return this.updateFunction(participationId, func.id, {code: func.code, order: func.order});
  }

  public updateFunction(participationId: string, functionId: string, body: IUpdateFunctionSessionCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${participationId}/functions/${functionId}`, body);
  }

  public removeFunction(participationId: string, functionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${participationId}/functions/${functionId}`);
  }

  public getToken(participationId: string): Observable<Token> {
    return this.http.get<Token>(`${this.apiUrl}/${participationId}/authentication`);
  }

  public getUsers(participationId: string): Observable<IUserSessionNavigation[]> {
    return this.fetchAll<IUserSessionNavigation>({url: `${this.apiUrl}/${participationId}/users`}).pipe(
      map(users => users.map(u => u.result))
    );
  }

  public getUser(participationId: string, userId: string): Observable<IUserSessionNavigation> {
    return this.http.get<HateoasResponse<IUserSessionNavigation>>(`${this.apiUrl}/${participationId}/users/${userId}`).pipe(
      map(res => res.result)
    );
  }

  public getUserSession(participationId: string, userId: string): Observable<IUserSessionNavigation> {
    return this.getUser(participationId, userId).pipe(
      switchMap(user => forkJoin({
        userSession: of(user),
        user: this._userService.getOneById(user.id)
      })),
      map(res => ({...res.user, ...res.user}) as IUserSession)
    );
  }


  public getUsersSessions(participationId: string): Observable<IUserSession[]> {
    return this.getUsers(participationId).pipe(
      switchMap(users => forkJoin(
        users.map(u => this._userService.getOneById(u.id).pipe(
          map(user => ({...user, ...u}))
        ))
      ))
    );
  }

  public getParticipation(participationId: string): Observable<IParticipationSession> {
    return this.getSessionById(participationId).pipe(
      switchMap(participation => forkJoin({
          participation: of(participation),
          step: this._stepService.getOneStepSession(participation.stepId),
          users: this.getUsersSessions(participationId),
          functions: this.getFunctions(participationId)
        })
      ),
      map(res => ({
        ...res.participation,
        step: res.step,
        users: res.users,
        functions: res.functions.map(f => AppFunction.new({...f, language: res.step.language.name, type: 'pipeline'}).parse())
      }))
    );
  }

}
