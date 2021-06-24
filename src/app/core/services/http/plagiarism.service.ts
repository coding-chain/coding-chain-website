import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {GetParams} from '../../../shared/models/http/get.params';
import {forkJoin, Observable, of} from 'rxjs';
import {
  IPlagiarismFunctionNavigation,
  IPlagiarizedFunction,
  IPlagiarizedFunctionNavigation,
  ISuspectFunction,
  ISuspectFunctionNavigation
} from '../../../shared/models/plagiarism/responses';
import {ISuspectFunctionsFilter} from '../../../shared/models/plagiarism/filter';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {map, switchMap} from 'rxjs/operators';
import {UserService} from './user.service';
import {LanguageService} from './language.service';
import _ from 'lodash';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {PublicUser} from '../../../shared/models/users/responses';
import {ParticipationService} from './participation.service';
import {IParticipationWithTournamentAndStep} from '../../../shared/models/participations/responses';
import {IUpdateSuspectFunctionValidity} from '../../../shared/models/plagiarism/commands';

@Injectable({
  providedIn: 'root'
})
export class PlagiarismService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/plagiarism`;

  constructor(http: HttpClient,
              private readonly _userService: UserService,
              private readonly _languageService: LanguageService,
              private readonly _participationService: ParticipationService) {
    super(http);
    this.getSuspectFunctionsNavigationFiltered = this.getSuspectFunctionsNavigationFiltered.bind(this);
    this.getSuspectFunctionsFiltered = this.getSuspectFunctionsFiltered.bind(this);
  }

  public getSuspectFunctionsNavigationFiltered(obj: GetParams<ISuspectFunctionNavigation, ISuspectFunctionsFilter>):
    Observable<HateoasPageResult<ISuspectFunctionNavigation>> {
    return this.getFiltered(obj);
  }

  public updateSuspectFunctionValidity(suspectFunctionId: string, body: IUpdateSuspectFunctionValidity): Observable<any> {
    return this.http.put(`${this.apiUrl}/functions/${suspectFunctionId}`, body);
  }


  public getSuspectFunctionsNavigationCursor(query?: GetParams<ISuspectFunctionNavigation, ISuspectFunctionsFilter>)
    : PageCursor<ISuspectFunctionNavigation, ISuspectFunctionsFilter> {
    return new PageCursor<ISuspectFunctionNavigation, ISuspectFunctionsFilter>(
      this.getSuspectFunctionsNavigationFiltered, {url: `${this.apiUrl}/functions`, ...query}
    );
  }

  public getAllPlagiarizedFunctionsBySuspectFunctionId(suspectFunctionId: string): Observable<IPlagiarizedFunctionNavigation[]> {
    return this.fetchAll<IPlagiarizedFunctionNavigation>({url: `${this.apiUrl}/functions/${suspectFunctionId}/plagiarized`}).pipe(
      map(res => res.map(el => el.result))
    );
  }

  public getSuspectFunctionsFiltered(obj: GetParams<ISuspectFunctionNavigation, ISuspectFunctionsFilter>):
    Observable<HateoasPageResult<ISuspectFunction>> {
    return this.getSuspectFunctionsNavigationFiltered(obj)
      .pipe(
        switchMap(page => {
          const suspectFunctions = page.result.map(suspectFunction => suspectFunction.result);
          const suspectFunctions$ = suspectFunctions.length ? suspectFunctions.map(suspectFunction => forkJoin({
            suspectFunction: of(suspectFunction),
            plagiarizedFunctions: this.getAllPlagiarizedFunctionsBySuspectFunctionId(suspectFunction.id)
          })) : [of(null)];
          return forkJoin({page: of(page), suspectFunctions: forkJoin([...suspectFunctions$])});
        }),
        switchMap(pageFuncs => {
          pageFuncs.suspectFunctions = pageFuncs.suspectFunctions.filter(f => f != null);
          const userIds: string[] = _.flatMap(
            pageFuncs.suspectFunctions.map(f => [f.suspectFunction.lastEditorId, ...f.plagiarizedFunctions.map(pF => pF.lastEditorId)])
          );

          const users$ = userIds.length ? forkJoin([...userIds.map(id => this._userService.getOneById(id))]) : forkJoin([of(null)]);
          return forkJoin({
            page: of(pageFuncs.page),
            languages: this._languageService.getAll(),
            suspectFunctions: of(pageFuncs.suspectFunctions),
            users: users$
          });
        }),
        switchMap(pageFunctions => {
          pageFunctions.suspectFunctions = pageFunctions.suspectFunctions.filter(f => f != null);
          const participationsIds: string[] = _.uniq(_.flatMap(pageFunctions.suspectFunctions
            .map(sF => [sF.suspectFunction.participationId, ...sF.plagiarizedFunctions.map(pF => pF.participationId)])));
          const participations$ = participationsIds.length ?
            participationsIds.map(id => this._participationService.getParticipationWithTournamentAndStep(id)) : [of(null)];
          return forkJoin({
            participations: forkJoin(participations$),
            pageFunctions: of(pageFunctions)
          });
        }),
        map(pageFunctionsParticipations => {
          const pageFunctions = pageFunctionsParticipations.pageFunctions;
          const suspectFunctions = pageFunctions.suspectFunctions.map(sF => {
            const {
              user,
              language
            } = this.extractLanguageAndUserForFunction(pageFunctions.languages, pageFunctions.users, sF.suspectFunction);
            const plagiarizedFunctions = this.toPlagiarizedFunctions(
              sF.plagiarizedFunctions,
              pageFunctionsParticipations.participations,
              pageFunctions.languages,
              pageFunctions.users);
            return {
              ...sF.suspectFunction,
              plagiarizedFunctions,
              lastEditor: user,
              participation: pageFunctionsParticipations.participations
                .find(participation => participation.id === sF.suspectFunction.participationId),
              language
            } as ISuspectFunction;
          });
          return pageFunctions.page.clone(suspectFunctions, (res, func) => res.result.id === func.id);
        })
      );
  }

  public getSuspectFunctionsCursor(query?: GetParams<ISuspectFunctionNavigation, ISuspectFunctionsFilter>)
    : PageCursor<ISuspectFunction, ISuspectFunctionsFilter> {
    return new PageCursor<ISuspectFunction, ISuspectFunctionsFilter>(
      this.getSuspectFunctionsFiltered, {url: `${this.apiUrl}/functions`, ...query}
    );
  }

  private toPlagiarizedFunctions(plagiarizedFunctions: IPlagiarizedFunctionNavigation[],
                                 participations: IParticipationWithTournamentAndStep[],
                                 languages: IProgrammingLanguage[],
                                 users: PublicUser[]): IPlagiarizedFunction[] {
    return plagiarizedFunctions.map(pF => {
      const {language, user} = this.extractLanguageAndUserForFunction(languages, users, pF);
      return {
        ...pF,
        language,
        lastEditor: user,
        participation: participations.find(participation => pF.participationId === participation.id)
      };
    });
  }

  private extractLanguageAndUserForFunction(languages: IProgrammingLanguage[], users: PublicUser[], func: IPlagiarismFunctionNavigation):
    { language: IProgrammingLanguage, user: PublicUser } {
    const user = users.find(u => u.id === func.lastEditorId);
    const language = languages.find(l => l.id === func.languageId);
    return {language, user};
  }

}
