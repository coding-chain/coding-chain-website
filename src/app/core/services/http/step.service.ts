import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map} from 'rxjs/operators';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {IStepNavigation} from '../../../shared/models/steps/responses';
import {GetParams} from '../../../shared/models/http/get.params';
import {ICreateTeamCommand} from '../../../shared/models/teams/commands';
import {IAddTestCommand, ICreateStepCommand, IUpdateStepCommand} from '../../../shared/models/steps/commands';
import {ITestNavigation} from '../../../shared/models/tests/responses';
import {IRightNavigation} from '../../../shared/models/rights/responses';

@Injectable({
  providedIn: 'root'
})
export class StepService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/steps`;

  constructor(http: HttpClient) {
    super(http);
    this.getStepNavigationFiltered = this.getStepNavigationFiltered.bind(this);

  }

  public getStepNavigationFiltered(obj: GetParams<IStepNavigation>): Observable<HateoasPageResult<IStepNavigation>> {
    return this.getFiltered(obj);
  }

  public getById(id: string): Observable<IStepNavigation | undefined> {
    return this.http.get<HateoasResponse<IStepNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getAllTests(id: string): Observable<ITestNavigation[]> {
    return this.fetchAll<ITestNavigation>({url: `${this.apiUrl}/tests`}).pipe(
      map(tests => tests.map(t => t.result))
    );
  }

  public getCursor(query: GetParams<IStepNavigation>): PageCursor<IStepNavigation, IStepNavigation> {
    return new PageCursor<IStepNavigation, IStepNavigation>(
      this.getStepNavigationFiltered, {url: this.apiUrl, ...query}
    );
  }

  public createOne(body: ICreateStepCommand): Observable<IStepNavigation> {
    return this.createAndGet<ICreateStepCommand, HateoasResponse<IStepNavigation>>(this.apiUrl, body)
      .pipe(
        map(res => res.result)
      );
  }

  public deleteOne(stepId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${stepId}`);
  }

  public updateOne(stepId: string, body: IUpdateStepCommand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${stepId}`, body);
  }

  public addTest(stepId: string, body: IAddTestCommand): Observable<ITestNavigation> {
    return this.createAndGet<IAddTestCommand, HateoasResponse<ITestNavigation>>(`${this.apiUrl}/${stepId}`, body)
      .pipe(
        map(res => res.result)
      );
  }

  public deleteTest(stepId: string, testId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${stepId}/tests/${testId}`);
  }

}
