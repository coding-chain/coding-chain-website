import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {combineLatest, EMPTY, forkJoin, Observable, of} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {catchError, map, switchMap} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {ITournamentNavigation, ITournamentStepNavigation} from '../../../shared/models/tournaments/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {
  ICreateTournamentCommand,
  ISetTournamentStepsCommand,
  IUpdateTournamentCommand,
  tournamentEditionStepToSetTournamentStepCommand,
  tournamentEditionToUpdateTournamentCommand
} from '../../../shared/models/tournaments/commands';
import {ITournamentsFilter} from '../../../shared/models/tournaments/filters';
import {ITournamentResume} from '../../../shared/models/tournaments/tournament-resume';
import {HateoasPageResponse} from '../../../shared/models/pagination/hateoas-page-response';
import * as _ from 'lodash';
import {StepService} from './step.service';
import {ParticipationService} from './participation.service';
import {IParticipationNavigation} from '../../../shared/models/participations/responses';
import {LanguageService} from './language.service';
import {IProgrammingLanguage, IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {ITournamentEdition, ITournamentEditionStep} from '../../../shared/models/tournaments/tournament-edition';
import {TestService} from './test.service';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {cloneStepResume, IStepResume} from '../../../shared/models/steps/responses';
import {ObjectUtils} from '../../../shared/utils/object.utils';

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

  public getTournamentNavigationFiltered(obj: GetParams<ITournamentNavigation, ITournamentsFilter>):
    Observable<HateoasPageResult<ITournamentNavigation>> {
    return this.getFiltered(obj);
  }


  public getTournamentNavigationCursor(query?: GetParams<ITournamentNavigation, ITournamentsFilter>)
    : PageCursor<ITournamentNavigation, ITournamentsFilter> {
    return new PageCursor<ITournamentNavigation, ITournamentsFilter>(
      this.getTournamentNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getTournamentResumeCursor(query?: GetParams<ITournamentResume, ITournamentsFilter>)
    : PageCursor<ITournamentResume, ITournamentsFilter> {
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
    return this.http.put(`${this.apiUrl}/${tournamentId}/steps`, body);
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

  public getStepNavigationFiltered(obj: GetParams<ITournamentStepNavigation, ITournamentStepNavigation>)
    : Observable<HateoasPageResult<ITournamentStepNavigation>> {
    return this.getFiltered(obj);
  }

  public getStepsCursor(tournamentId: string, query: GetParams<ITournamentStepNavigation>)
    : PageCursor<ITournamentStepNavigation, ITournamentStepNavigation> {
    return new PageCursor<ITournamentStepNavigation, ITournamentStepNavigation>(this.getStepNavigationFiltered, {url: `${this.apiUrl}/${tournamentId}`, ...query});
  }

  public getTournamentResumeFiltered(obj: GetParams<ITournamentResume, ITournamentsFilter>)
    : Observable<HateoasPageResult<ITournamentResume>> {
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
          map((res: [IProgrammingLanguageNavigation[], ITournamentEditionStep[]]) => {
            const tournament: ITournamentEdition = {...t, steps: []};
            const languages = res[0] as IProgrammingLanguageNavigation[];
            const steps = res[1] as ITournamentEditionStep[];
            tournament.steps = steps.map(step => ({language: languages.find(l => step.languageId === l.id), ...step}));
            tournament.steps.sort((s1, s2) => s1.order - s2.order);
            return tournament;
          })
        );
      })
    );
  }

  public getAllTournamentsSteps(tournamentId: string): Observable<ITournamentStepNavigation[]> {
    return this.fetchAll<ITournamentStepNavigation>({url: `${this.apiUrl}/${tournamentId}/steps`}).pipe(
      map(tournamentSteps => tournamentSteps.map(tournamentStep => ({id: tournamentStep.result.stepId, ...tournamentStep.result})))
    );
  }


  updateFullTournament(originTournament: ITournamentEdition, originSteps: IStepResume[], editedTournament: ITournamentEdition)
    : Observable<any> {

    const upsertSteps$ = this.upsertSteps(originSteps, editedTournament.steps);
    const updateDetail$ = this.updateTournamentDetail(originTournament, editedTournament);
    return upsertSteps$.pipe(
      switchMap(addedSteps => {
        editedTournament.steps = editedTournament.steps.map(editedTournamentStep => {
          const addedStep = addedSteps.find(s => s.order === editedTournamentStep.order);
          if (addedStep) {
            editedTournamentStep.stepId = addedStep.id;
          }
          return editedTournamentStep;
        });
        return this.updateTournamentSteps(editedTournament.id, originTournament.steps, editedTournament.steps);
      }),
      switchMap(res => updateDetail$),
      switchMap(res => this.getTournamentEdition(editedTournament.id))
    );
  }

  updateTournamentSteps(tournamentId: string, originSteps: ITournamentEditionStep[], editedSteps: ITournamentEditionStep[])
    : Observable<any> {
    const originTournamentSteps = originSteps.map(tournamentStep => tournamentEditionStepToSetTournamentStepCommand(tournamentStep));
    const editedTournamentSteps = editedSteps.map(tournamentStep => tournamentEditionStepToSetTournamentStepCommand(tournamentStep));
    if (!_.isEqual(originTournamentSteps, editedTournamentSteps)) {
      return this.updateSteps(tournamentId, {steps: editedTournamentSteps});
    }
    return of([]);
  }

  private updateTournamentDetail(originTournament: ITournamentEdition, editedTournament: ITournamentEdition): Observable<any> {
    const originUpdate = tournamentEditionToUpdateTournamentCommand(originTournament);
    const editedUpdate = tournamentEditionToUpdateTournamentCommand(editedTournament);
    if (!_.isEqual(originUpdate, editedUpdate)) {
      return this.updateOne(editedTournament.id, editedUpdate);
    }
    return of([]);
  }


  private upsertSteps(originSteps: IStepResume[], editedTournamentSteps: ITournamentEditionStep[]): Observable<any> {
    const editedSteps = editedTournamentSteps.map(s => cloneStepResume(s));
    originSteps = originSteps.map(s => cloneStepResume(s));
    const existingSteps = originSteps.filter(s => !!s.id);
    const newSteps = editedTournamentSteps.filter(s => !s.id);
    const existingEditedSteps = editedSteps.filter(s => !!s.id);
    const stepsForUpdate = ObjectUtils.getNotEqualsObjectsWith(existingSteps, existingEditedSteps,
      (existingStep, editedStep) => existingStep.id === editedStep.id);
    const updateSteps$ = stepsForUpdate.length > 0 ? stepsForUpdate.map(s => this._stepService.updateStepWithComparison(s)) : of([]);
    const addSteps$ = newSteps.length ? newSteps.map(tournamentStep => this._stepService
      .createOneStepResumeAndGetId(tournamentStep)
      .pipe(
        map(id => ({id, ...tournamentStep}) as ITournamentEditionStep
        )
      )) : of([]);
    return forkJoin(updateSteps$).pipe(
      switchMap(res => forkJoin(addSteps$)),
    );
  }


  private getTournamentStepEditions(tournamentId: string): Observable<ITournamentEditionStep[]> {
    return this.getAllTournamentsSteps(tournamentId).pipe(
      switchMap(steps => {
        return forkJoin([of(steps), this.getStepEditionsTest(steps.map(s => s.stepId))]);
      }),
      map((res: [ITournamentStepNavigation[], ITestNavigation[]]) => {
        const steps = res[0] as ITournamentStepNavigation[];
        const stepsTests = _.flatMap(res[1]) as ITestNavigation[];
        return steps.map(step => {
          const stepTest = stepsTests.filter(sT => sT.stepId === step.id);
          return {tests: stepTest, ...step} as ITournamentEditionStep;
        });
      })
    );
  }

  private getStepEditionsTest(stepIds: string[]): Observable<ITestNavigation[]> {
    if (stepIds?.length > 0) {
      return forkJoin(...stepIds.map(stepId => this._stepService.getAllTests(stepId)));
    }
    return of([]);
  }

  private toTournamentResumePage(page: HateoasPageResponse<ITournamentNavigation>): Observable<HateoasPageResult<ITournamentResume>> {
    const tournamentsResult = page.result.map(el => ({steps: [], participations: [], ...el.result} as ITournamentResume));
    return this._languageService.getAll().pipe(
      map(languages => [tournamentsResult, languages]),
      switchMap((res: [ITournamentResume[], IProgrammingLanguage[]]) => this.getTournamentsWithSteps(res[0], res[1])),
      map((res: [ITournamentResume[], IProgrammingLanguage[], ITournamentStepNavigation[]]) =>
        this.setStepResumeForTournaments(res[0], res[1], _.flatMap(res.slice(2)))
      ),
      switchMap((tournaments: ITournamentResume[]) => this.getParticipationsForTournaments(tournaments)),
      map((res: [ITournamentResume[], IParticipationNavigation[]]) =>
        this.setParticipationsForTournaments(res[0], _.flatMap(res.slice(1)))),
      map((tournaments: ITournamentResume[]) =>
        page.clone<ITournamentResume>(tournaments, (res, tournament) => res.result.id === tournament.id))
    );
  }

  private setParticipationsForTournaments(tournaments: ITournamentResume[], participations: IParticipationNavigation[])
    : ITournamentResume[] {
    tournaments.forEach(tournament => tournament.participations = participations.filter(p => p.tournamentId === tournament.id));
    return tournaments;
  }

  private getParticipationsForTournaments(tournaments: ITournamentResume[])
    : Observable<(ITournamentResume[] | IParticipationNavigation[])[]> {
    const participations$ = tournaments.map(t => this.getParticipations(t.participationsIds));
    return forkJoin([of(tournaments), ...participations$]);
  }

  private setStepResumeForTournaments(tournaments: ITournamentResume[],
                                      languages: IProgrammingLanguage[],
                                      tournamentSteps: ITournamentStepNavigation[]): ITournamentResume[] {
    tournaments.forEach(tournament => {
      tournament.steps = tournamentSteps.filter(tS => tS.tournamentId === tournament.id)
        .map(step => ({language: languages.find(l => l.id === step.languageId), ...step}));
    });
    return tournaments;
  }

  private getTournamentsWithSteps(tournaments: ITournamentResume[], languages: IProgrammingLanguageNavigation[]): Observable<any> {
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
