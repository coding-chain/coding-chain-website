import {Injectable} from '@angular/core';
import {ApiHelperService, ForkJoinRes, HateoasPageResult, HateoasResultMapping, ResultMapping} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {EMPTY, forkJoin, Observable, of} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITournamentNavigation, ITournamentStepNavigation} from '../../../shared/models/tournaments/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {
  ICreateTournamentCommand,
  ISetTournamentStepsCommand,
  IUpdateTournamentCommand
} from '../../../shared/models/tournaments/commands';
import {IUpdateStepCommand} from '../../../shared/models/steps/commands';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {ITournamentResume, ITournamentResumeStep} from '../../../shared/models/tournaments/tournament-resume';
import {HateoasPageResponse} from '../../../shared/models/pagination/hateoas-page-response';
import * as _ from 'lodash';
import {StepService} from './step.service';
import Swal from 'sweetalert2';
import {ParticipationService} from './participation.service';
import {IParticipationNavigation} from '../../../shared/models/participations/responses';
import {LanguageService} from './language.service';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {TestService} from './test.service';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {ITestNavigation} from '../../../shared/models/tests/responses';

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(http: HttpClient,
              private readonly _stepService: StepService,
              private readonly _participationService: ParticipationService,
              private readonly _languageService: LanguageService,
              private readonly _testService: TestService) {
    super(http);
    this.getTournamentNavigationFiltered = this.getTournamentNavigationFiltered.bind(this);
    this.getStepNavigationFiltered = this.getStepNavigationFiltered.bind(this);
    this.getTournamentResumeFiltered = this.getTournamentResumeFiltered.bind(this);
  }

  public getById(id: string): Observable<ITournamentNavigation | undefined> {
    return this.http.get<HateoasResponse<ITournamentNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getTournamentNavigationFiltered(obj: GetParams<ITournamentNavigation, ITournamentsFilter>): Observable<HateoasPageResult<ITournamentNavigation>> {
    return this.getFiltered(obj);
  }


  public getTournamentNavigationCursor(query?: GetParams<ITournamentNavigation, ITournamentsFilter>): PageCursor<ITournamentNavigation, ITournamentsFilter> {
    return new PageCursor<ITournamentNavigation, ITournamentsFilter>(
      this.getTournamentNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getTournamentResumeCursor(query?: GetParams<ITournamentResume, ITournamentsFilter>): PageCursor<ITournamentResume, ITournamentsFilter> {
    return new PageCursor<ITournamentResume, ITournamentsFilter>(
      this.getTournamentResumeFiltered, {url: this.apiUrl, ...query}
    );
  }

  public createOne(body: ICreateTournamentCommand): Observable<ITournamentNavigation> {
    return this.createAndGet<ICreateTournamentCommand, HateoasResponse<ITournamentNavigation>>(`${this.apiUrl}`, body)
      .pipe(
        map(res => res.result)
      );
  }

  public deleteOne(tournamentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tournamentId}`);
  }

  public updateOne(tournamentId: string, body: IUpdateTournamentCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${tournamentId}`, body);
  }

  public updateSteps(tournamentId: string, body: ISetTournamentStepsCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${tournamentId}`, body);
  }

  public deleteStep(tournamentId: string, stepId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tournamentId}/steps/${stepId}`);
  }

  public getTournamentStep(tournamentId: string, stepId: string): Observable<ITournamentStepNavigation> {
    return this.http.get<HateoasResponse<ITournamentStepNavigation>>(`${this.apiUrl}/${tournamentId}/steps/${stepId}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getStepNavigationFiltered(obj: GetParams<ITournamentStepNavigation, ITournamentStepNavigation>): Observable<HateoasPageResult<ITournamentStepNavigation>> {
    return this.getFiltered(obj);
  }

  public getStepsCursor(tournamentId: string, query: GetParams<ITournamentStepNavigation>): PageCursor<ITournamentStepNavigation, ITournamentStepNavigation> {
    return new PageCursor<ITournamentStepNavigation, ITournamentStepNavigation>(this.getStepNavigationFiltered, {url: `${this.apiUrl}/${tournamentId}`, ...query});
  }

  public getTournamentResumeFiltered(obj: GetParams<ITournamentResume, ITournamentsFilter>): Observable<HateoasPageResult<ITournamentResume>> {
    return this.getFiltered<ITournamentNavigation, ITournamentResume, ITournamentsFilter>(obj).pipe(
      switchMap((page) => {
        return this.toTournamentResumePage(page);
      }),
      catchError(err => EMPTY)
    );
  }

  public getTournamentEdition(id: string): Observable<ITournamentEdition> {
    return this.getById(id).pipe(
      switchMap(t => {
        return this._languageService.getAll().pipe(
          switchMap(languages =>
              forkJoin([of(languages),this.getTournamentStepEditions(t.id, t.stepsIds)])
            ),
            map((res:[ IProgrammingLanguageNavigation[] , Partial<ITournamentEditionStep>[]]) => {
              const tournament: ITournamentEdition = {...t, steps: []};
              const languages = res[0] as IProgrammingLanguageNavigation[];
              const steps = res[1] as ITournamentEditionStep[];
              tournament.steps = steps.map(step => ({language: languages.find(l => step.languageId == l.id),...step}))
              return tournament;
            })
          )
      })
    );
  }

  private getTournamentStepEditions(tournamentId: string, stepIds: string[]) {
    return this.getTournamentSteps(tournamentId, stepIds).pipe(
      switchMap(steps => {
        return forkJoin([of(steps), ...this.setStepEditionTests(steps.map(s => s.stepId))]);
      }),
      map((res: [ITournamentStepNavigation[] | ForkJoinRes<string, ITestNavigation[]>]) => {
        const steps = res[0] as ITournamentStepNavigation[];
        const stepsTests = res.slice(1) as ForkJoinRes<string, ITestNavigation[]>[];
        return steps.map(step => {
          const stepTest = stepsTests.find(sT => sT.id == step.id);
          return {tests: stepTest.res, ...step} as Partial<ITournamentEditionStep>;
        });
      })
    );
  }

  private setStepEditionTests(stepIds: string[]): Observable<ForkJoinRes<string, ITestNavigation[]>>[] {
    return stepIds.map(step => this._stepService.getAllTests(step).pipe(
      map(tests => ({id: step, res: tests}))
    ));
  }

  private toTournamentResumePage(page: HateoasPageResponse<HateoasResponse<ITournamentNavigation>[]>) {
    const tournamentMapping: HateoasResultMapping<ITournamentNavigation, ITournamentResume>[] = page.result.map(tournament => ({
      source: tournament,
      target: new HateoasResponse({
        result: {steps: [], participations: [], ...tournament.result},
        links: tournament.links
      })
    }));
    const resumePage = new HateoasPageResponse({
      result: tournamentMapping.map(mapping => mapping.target),
      total: page.total,
      links: page.links
    }) as HateoasPageResult<ITournamentResume>;

    return this._languageService.getAll().pipe(
      switchMap(languages => {
          const steps$ = this.getTournamentStepsWithLanguages(tournamentMapping, languages).pipe(tap(res => console.log(res)));
          const participations$ = tournamentMapping.map(tournament => this.getParticipations(tournament.source.result.participationsIds).pipe(
            tap(participations => tournament.target.result.participations = participations)
          ));
          return forkJoin([of(resumePage), steps$, ...participations$]);
        }
      ),
      map((res: [HateoasPageResult<ITournamentResume>]) => res[0])
    );
  }

  private getTournamentStepsWithLanguages(tournamentMapping: HateoasResultMapping<ITournamentNavigation, ITournamentResume>[], languages: IProgrammingLanguageNavigation[]) {
    return forkJoin(tournamentMapping.map(tournament =>
      this.getTournamentSteps(tournament.source.result.id, tournament.source.result.stepsIds).pipe(
        tap(steps =>
          tournament.target.result.steps = steps.map(step => ({language: languages.find(l => l.id == step.languageId), ...step}))
        ))));
  }

  private getTournamentSteps(tournamentId: string, stepIds: string[]): Observable<ITournamentStepNavigation[]> {
    if (stepIds?.length > 0) {
      return forkJoin(stepIds.map(stepId => this.getTournamentStep(tournamentId, stepId)));
    }
    return of([]);
  }

  private getParticipations(participationIds: string[]): Observable<IParticipationNavigation[]> {
    if (participationIds?.length > 0) {
      return forkJoin(participationIds.map(participationId => this._participationService.getById(participationId)));
    }
    return of([]);
  }
}
