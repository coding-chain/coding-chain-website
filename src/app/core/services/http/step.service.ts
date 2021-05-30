import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {forkJoin, Observable, of} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map, switchMap, tap} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IStepNavigation, IStepResume} from '../../../shared/models/steps/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {
  IAddTestCommand,
  ICreateStepCommand,
  ISetTestsCommand,
  IUpdateStepCommand,
  stepResumeToSetTestCommand,
  stepResumeToUpdateStepCommand
} from '../../../shared/models/steps/commands';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {IStepsFilter} from '../../../shared/models/steps/filters';
import {HateoasPageResponse} from '../../../shared/models/pagination/hateoas-page-response';
import {LanguageService} from './language.service';
import * as _ from 'lodash';
import {IProgrammingLanguage} from '../../../shared/models/programming-languages/responses';
import {IObjectUpdateResume} from '../../../shared/models/object-difference';
import {IStepSession} from '../../../shared/models/participations-session/participation-session';
import {AppFunction} from '../../../shared/models/function-session/responses';

@Injectable({
  providedIn: 'root'
})
export class StepService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/steps`;

  constructor(http: HttpClient, private readonly _languageService: LanguageService) {
    super(http);
    this.getStepNavigationFiltered = this.getStepNavigationFiltered.bind(this);
    this.getStepResumeFiltered = this.getStepResumeFiltered.bind(this);
  }

  public getStepNavigationFiltered(obj: GetParams<IStepNavigation, IStepsFilter>): Observable<HateoasPageResult<IStepNavigation>> {
    return this.getFiltered(obj);
  }

  public getStepResumeFiltered(obj: GetParams<IStepNavigation, IStepsFilter>): Observable<HateoasPageResult<IStepResume>> {
    return this.getFiltered<IStepResume, IStepNavigation, IStepsFilter>(obj).pipe(
      switchMap(res => this.toStepResumePage(res))
    );
  }

  public getById(id: string): Observable<IStepNavigation | undefined> {
    return this.http.get<HateoasResponse<IStepNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getAllTests(id: string): Observable<ITestNavigation[]> {
    return this.fetchAll<ITestNavigation>({url: `${this.apiUrl}/${id}/tests`}).pipe(
      map(tests => tests.map(t => {
        return t.result;
      }))
    );
  }


  public getFirstTest(id: string): Observable<ITestNavigation | undefined> {
    return this.getFiltered<ITestNavigation>({url: `${this.apiUrl}/${id}/tests`, page: 1, size: 1}).pipe(
      map(page => page.result.shift()?.result)
    );
  }


  public getNavigationCursor(query: GetParams<IStepNavigation, IStepsFilter>): PageCursor<IStepNavigation, IStepsFilter> {
    return new PageCursor<IStepNavigation, IStepsFilter>(
      this.getStepNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getResumeCursor(query: GetParams<IStepNavigation, IStepsFilter>): PageCursor<IStepResume, IStepsFilter> {
    return new PageCursor<IStepResume, IStepsFilter>(
      this.getStepResumeFiltered, {url: this.apiUrl, ...query}
    );
  }

  public createOne(body: ICreateStepCommand): Observable<IStepNavigation> {
    return this.createAndGet<ICreateStepCommand, HateoasResponse<IStepNavigation>>(this.apiUrl, body)
      .pipe(
        map(res => res.result)
      );
  }

  public createOneResume(step: IStepResume): Observable<IStepResume> {
    return this.createOneAndGet(stepResumeToUpdateStepCommand(step)).pipe(
      switchMap(createdStep => forkJoin([of(createdStep), this.setTests(createdStep.result.id, stepResumeToSetTestCommand(step))])),
      switchMap((res: [HateoasResponse<IStepNavigation>, any]) => this.toStepResume(res[0].result))
    );
  }

  public createOneAndGetId(body: ICreateStepCommand): Observable<string> {
    return this.createAndGetIds(this.apiUrl, body).pipe(
      map(ids => ids.pop())
    );
  }

  public createOneAndGet(body: ICreateStepCommand): Observable<HateoasResponse<IStepNavigation>> {
    return this.createAndGet(`${this.apiUrl}`, body);
  }

  public createOneStepResumeAndGetId(step: IStepResume): Observable<string> {
    return this.createOneAndGetId(stepResumeToUpdateStepCommand(step)).pipe(
      switchMap(id =>
        forkJoin([of(id), this.setTests(id, stepResumeToSetTestCommand(step))])
      ),
      map((res: [string, any]) => res[0])
    );
  }

  public deleteOne(stepId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${stepId}`);
  }

  public updateOne(stepId: string, body: IUpdateStepCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${stepId}`, body).pipe(
      tap(res => console.log(res))
    );
  }

  public addTest(stepId: string, body: IAddTestCommand): Observable<ITestNavigation> {
    return this.createAndGet<IAddTestCommand, HateoasResponse<ITestNavigation>>(`${this.apiUrl}/${stepId}`, body)
      .pipe(
        map(res => res.result)
      );
  }

  public setTests(stepId: string, body: ISetTestsCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${stepId}/tests`, body).pipe(
      tap(res => console.log(res))
    );
  }


  public deleteTest(stepId: string, testId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${stepId}/tests/${testId}`);
  }

  public updateStepWithComparisonAndGet(comparison: IObjectUpdateResume<IStepResume>): Observable<IStepResume> {
    return this.updateStepWithComparison(comparison).pipe(
      switchMap(res => this.getById(comparison.editedVersion.id)),
      switchMap(step => this.toStepResume(step))
    );
  }

  public getOneStepSession(stepId: string): Observable<IStepSession> {
    return this.getById(stepId).pipe(
      switchMap(step => forkJoin({
        step: of(step),
        language: this._languageService.getById(step.languageId),
        test: this.getFirstTest(stepId)
      })),
      map(res => {
          const step = {...res.step, language: res.language} as IStepSession;
          if (res.test) {
            step.inGenOutputType = AppFunction.new({code: res.test.inputGenerator, language: res.language.name}).parse().outputType;
            step.outValParamType = AppFunction.new({code: res.test.outputValidator, language: res.language.name}).parse().inputType;
          }
          return step;
        }
      )
    );
  }

  public updateStepWithComparison(comparison: IObjectUpdateResume<IStepResume>): Observable<any> {
    const editedVersion: IStepResume = comparison.editedVersion;
    let updateObs$ = of([]);
    if (!comparison.editedVersion.id) {
      return updateObs$;
    }
    if (comparison.differentProperties.some(p => p === 'tests')) {
      updateObs$ = this.setTests(editedVersion.id, stepResumeToSetTestCommand(editedVersion));
    }
    if (comparison.differentProperties.some(p => p !== 'tests')) {
      updateObs$ = updateObs$.pipe(
        switchMap(res =>
          this.updateOne(editedVersion.id, stepResumeToUpdateStepCommand(editedVersion))
        )
      );
    }
    return updateObs$;
  }

  private toStepResumePage(page: HateoasPageResponse<IStepNavigation>): Observable<HateoasPageResult<IStepResume>> {
    const steps = page.result.map(el => el.result);
    return this._languageService.getAll().pipe(
      switchMap(languages => forkJoin({languages: of(languages), steps: of(steps), tests: this.getAllTestsBySteps(steps.map(s => s.id))})),
      map((res: { languages: IProgrammingLanguage[], steps: IStepNavigation[], tests: ITestNavigation[] }) => {
        const stepsResumes: IStepResume[] = res.steps.map(step => {
          const language = res.languages.find(l => l.id === step.languageId);
          const tests = res.tests.filter(test => test.stepId === step.id);
          return {language, tests, ...step};
        });
        return page.clone(stepsResumes, ((pageElement, subElement) => pageElement.result.id === subElement.id));
      })
    );
  }

  private toStepResume(step: IStepNavigation): Observable<IStepResume> {
    return this._languageService.getById(step.languageId).pipe(
      switchMap(language => forkJoin({language: of(language), tests: this.getAllTests(step.id)})),
      map(res => {
        return {language: res.language, tests: res.tests, ...step};
      })
    );
  }

  private getAllTestsBySteps(stepsIds: string[]): Observable<ITestNavigation[]> {
    if (!stepsIds.length) {
      return of([]);
    }
    return forkJoin([...stepsIds.map(id => this.getAllTests(id))]).pipe(
      map((res: [ITestNavigation[]]) => {
        return _.flatMap(res);
      })
    );
  }


}


