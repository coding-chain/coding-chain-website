import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {combineLatest, EMPTY, forkJoin, Observable, of} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITournamentNavigation, ITournamentStepNavigation} from '../../../shared/models/tournaments/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {ICreateTournamentCommand, ISetTournamentStepsCommand, IUpdateTournamentCommand} from '../../../shared/models/tournaments/commands';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {HateoasPageResponse} from '../../../shared/models/pagination/hateoas-page-response';
import * as _ from 'lodash';
import {StepService} from './step.service';
import {ParticipationService} from './participation.service';
import {IParticipationNavigation} from '../../../shared/models/participations/responses';
import {LanguageService} from './language.service';
import {IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {TestService} from './test.service';
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
          switchMap(languages => combineLatest([of(languages), this.getTournamentStepEditions(t.id)])),
          map((res: [IProgrammingLanguageNavigation[],ITournamentEditionStep[]]) => {
            const tournament: ITournamentEdition = {...t, steps: []};
            const languages = res[0] as IProgrammingLanguageNavigation[];
            const steps = res[1] as ITournamentEditionStep[];
            tournament.steps = steps.map(step => ({language: languages.find(l => step.languageId == l.id), ...step}));
            return tournament;
          })
        );
      })
    );
  }

  public getAllTournamentsSteps(tournamentId: string): Observable<ITournamentStepNavigation[]> {
    return this.fetchAll<ITournamentStepNavigation>({url: `${this.apiUrl}/${tournamentId}/steps`}).pipe(
      map(res => res.map(res => res.result))
    );
  }

  private getTournamentStepEditions(tournamentId: string): Observable<ITournamentEditionStep[]> {
    return this.getAllTournamentsSteps(tournamentId).pipe(
      switchMap(steps => {
        return forkJoin([of(steps), this.getStepEditionsTest(steps.map(s => s.stepId))]);
      }),
      map((res: [ITournamentStepNavigation[], ITestNavigation[]]) => {
        const steps = res[0] as ITournamentStepNavigation[];
        const stepsTests = _.flatMap(res.slice(1)) as ITestNavigation[];
        return steps.map(step => {
          const stepTest = stepsTests.filter(sT => sT.stepId == step.id);
          return {tests: stepTest, ...step} as ITournamentEditionStep;
        });
      })
    );
  }

  private getStepEditionsTest(stepIds: string[]): Observable<ITestNavigation[]> {
    if (stepIds?.length > 0) {
      forkJoin(...stepIds.map(stepId => this._stepService.getAllTests(stepId)));
    }
    return of([]);
  }

  private toTournamentResumePage(page: HateoasPageResponse<ITournamentNavigation>) {
    const tournaments = page.result.map(el => ({steps: [], participations: [], ...el.result} as ITournamentResume));
    return this._languageService.getAll().pipe(
      map(languages => [tournaments, languages]),
      switchMap((res: [ITournamentResume[], IProgrammingLanguageNavigation[]]) => this.getTournamentsWithSteps(res[0], res[1])),
      map((res: [ITournamentResume[], IProgrammingLanguageNavigation[], ITournamentStepNavigation[]]) =>
        this.setStepResumeForTournaments(res[0], res[1], _.flatMap(res.slice(2)))
      ),
      switchMap((tournaments: ITournamentResume[]) => this.getParticipationsForTournaments(tournaments)),
      map((res: [ITournamentResume[], IParticipationNavigation[]]) => this.setParticipationsForTournaments(res[0], _.flatMap(res.slice(1)))),
      map((tournamentsResult: ITournamentResume[]) => page.clone<ITournamentResume>(tournamentsResult, (res, tournament) => res.result.id === tournament.id))
    );
  }

  private setParticipationsForTournaments(tournaments: ITournamentResume[], participations: IParticipationNavigation[]) {
    tournaments.forEach(tournament => tournament.participations = participations.filter(p => p.tournamentId == tournament.id));
    return tournaments;
  }

  private getParticipationsForTournaments(tournaments: ITournamentResume[]) {
    const participations$ = tournaments.map(t => this.getParticipations(t.participationsIds));
    return forkJoin([of(tournaments), ...participations$]);
  }

  private setStepResumeForTournaments(tournaments: ITournamentResume[], languages: IProgrammingLanguageNavigation[], tournamentSteps: ITournamentStepNavigation[]) {
    tournaments.forEach(tournament => {
      tournament.steps = tournamentSteps.filter(tS => tS.tournamentId == tournament.id)
        .map(step => ({language: languages.find(l => l.id == step.languageId), ...step}));
    });
    return tournaments;
  }

  private getTournamentsWithSteps(tournaments: ITournamentResume[], languages: IProgrammingLanguageNavigation[]) {
    const steps$ = tournaments
      .map(tournament => {
        if (tournament.stepsIds?.length > 0) {
          this.getAllTournamentsSteps(tournament.id);
        }
        return of([]);
      });
    return forkJoin([of(tournaments), of(languages), ...steps$]);
  }


  private getTournamentStepsByIds(tournamentId: string, stepIds: string[]): Observable<ITournamentStepNavigation[]> {
    if (stepIds?.length > 0) {
      return forkJoin([...stepIds.map(stepId => this.getTournamentStep(tournamentId, stepId))]);
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
