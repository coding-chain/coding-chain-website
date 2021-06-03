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
import {IFunctionSessionNavigation} from '../../../shared/models/function-session/responses';
import {IParticipationSessionNavigation} from '../../../shared/models/participations-session/responses';
import {IAddFunctionSessionCommand, IUpdateFunctionSessionCommand} from '../../../shared/models/function-session/commands';
import {StepService} from './step.service';
import {
  IUserSession,
  ParticipationSession,
  TournamentStepParticipation
} from '../../../shared/models/participations-session/participation-session';
import {UserService} from './user.service';
import {IFunctionSessionFilter} from '../../../shared/models/function-session/filters';
import {TournamentService} from './tournament.service';
import {TeamService} from './team.service';
import {ParticipationService} from './participation.service';
import {AppFunction} from '../../../shared/models/function-session/app-function';
import {FunctionFactory} from '../../../shared/models/function-session/function-factory';

@Injectable({
  providedIn: 'root'
})
export class ParticipationSessionService extends ApiHelperService {

  protected apiUrl = `${environment.apiUrl}/participationsessions`;

  constructor(http: HttpClient,
              private readonly _authService: AuthenticationService,
              private readonly _tournamentService: TournamentService,
              private readonly _stepService: StepService,
              private readonly _teamService: TeamService,
              private readonly _participationService: ParticipationService,
              private readonly _userService: UserService) {
    super(http);
  }


  public getFunctionById(participationId: string, functionId: string): Observable<IFunctionSessionNavigation> {
    return this.http.get<HateoasResponse<IFunctionSessionNavigation>>(`${this.apiUrl}/${participationId}/functions/${functionId}`).pipe(
      map(f => f.result)
    );
  }

  public getFunctions(participationId: string, filter?: IFunctionSessionFilter): Observable<IFunctionSessionNavigation[]> {
    return this.fetchAll<IFunctionSessionNavigation, IFunctionSessionNavigation, IFunctionSessionFilter>({
      url: `${this.apiUrl}/${participationId}/functions`,
      filterObj: filter
    }).pipe(
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
      return this.addFunction(participationId, {code: func.codeWithoutHeader, order: func.order});
    }
    return this.updateFunction(participationId, func.id, {code: func.codeWithoutHeader, order: func.order});
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

  public elevateUser(participationId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${participationId}/users/${userId}/elevation`, {});
  }

  public startExecution(participationId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${participationId}/execution`, {});
  }


  public getUserSession(participationId: string, userId: string): Observable<IUserSession> {
    return this.getUser(participationId, userId).pipe(
      switchMap(user => forkJoin({
        userSession: of(user),
        user: this._userService.getOneById(user.id)
      })),
      map(res => ({...res.userSession, ...res.user}) as IUserSession)
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

  public getParticipation(participationId: string): Observable<ParticipationSession> {
    return this.getSessionById(participationId).pipe(
      switchMap(participation => forkJoin({
          participation: of(participation),
          step: this._stepService.getOneStepSession(participation.stepId),
          users: this.getUsersSessions(participationId),
          functions: this.getFunctions(participationId),
          allParticipations: this.getAllTournamentStepParticipations(participation.tournamentId, participation.teamId)
        })
      ),
      map(res => {
        const currentStepParticipation = res.allParticipations.find(p => p.id === res.participation.id);
        return new ParticipationSession({
          ...res.participation,
          step: {isOptional: currentStepParticipation.isOptional, order: currentStepParticipation.order, ...res.step},
          users: res.users,
          allParticipations: res.allParticipations,
          functions: res.functions.map(f => FunctionFactory.new({
            ...f,
            language: res.step.language.name,
            type: 'pipeline',
            header: res.step.headerCode
          }).parse())
        });
      })
    );
  }

  private getAllTournamentStepParticipations(tournamentId: string, teamId: string): Observable<TournamentStepParticipation[]> {
    return forkJoin({
      tournamentSteps: this._tournamentService.getAllTournamentsSteps(tournamentId),
      participations: this._participationService.getAllParticipationNavigationFiltered({filterObj: {tournamentId, teamId}}),
    }).pipe(
      map(res =>
        res.tournamentSteps.map(tS => {
          const participation = res.participations.find(p => p.stepId === tS.stepId);
          return {
            stepId: tS.stepId,
            id: participation?.id,
            tournamentId: tS.tournamentId,
            teamId,
            order: tS.order,
            isOptional: tS.isOptional
          } as TournamentStepParticipation;
        })
      )
    );
  }
}
