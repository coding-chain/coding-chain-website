import {Injectable} from '@angular/core';
import {ApiHelperService, HateoasPageResult} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {forkJoin, Observable, of} from "rxjs";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map, switchMap, tap} from "rxjs/operators";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {ITournamentNavigation, ITournamentStepNavigation} from "../../../shared/models/tournaments/responses";
import {GetParams} from "../../../shared/models/http/get.params";
import {
  ICreateTournamentCommand,
  ISetTournamentStepsCommand,
  IUpdateTournamentCommand
} from "../../../shared/models/tournaments/commands";
import {IUpdateStepCommand} from "../../../shared/models/steps/commands";
import {ITournamentsFilter} from "../../../shared/models/tournaments/filters";
import {TournamentResume, TournamentResumeStep} from "../../../shared/models/tournaments/tournament-resume";
import {HateoasPageResponse} from "../../../shared/models/pagination/hateoas-page-response";
import * as _ from "lodash";
import {StepService} from "./step.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(http: HttpClient, private readonly _stepService: StepService) {
    super(http);
    this.getTournamentNavigationFiltered = this.getTournamentNavigationFiltered.bind(this);
    this.getStepNavigationFiltered = this.getStepNavigationFiltered.bind(this);
    this.getTournamentResumeFiltered = this.getTournamentResumeFiltered.bind(this);
  }

  public getById(id: string): Observable<ITournamentNavigation | undefined> {
    return this.http.get<HateoasResponse<ITournamentNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }


  public getTournamentNavigationFiltered(obj: GetParams<ITournamentNavigation, ITournamentsFilter>): Observable<HateoasPageResult<ITournamentNavigation>> {
    return this.getFiltered(obj);
  }

  public getTournamentResumeFiltered(obj: GetParams<TournamentResume, ITournamentsFilter>): Observable<HateoasPageResult<TournamentResume>> {
    return this.getFiltered<ITournamentNavigation, TournamentResume, ITournamentsFilter>(obj).pipe(
      map((page) => {
        const resumePage = new HateoasPageResponse({
          result: page.result.map(tournament => new HateoasResponse({
            result: new TournamentResume({...tournament.result}),
            links: tournament.links
          })),
          total: page.total,
          links: page.links
        }) as HateoasPageResult<TournamentResume>;
        // const observables = [of(resumePage), _.flatMap(
        //   page.result.map(tournament => _.flatMap(
        //     tournament.result.stepsIds.map(stepId => this.getStep(tournament.result.id, stepId).pipe(
        //       tap(tournamentStep => this._stepService.getById(tournamentStep.stepId).pipe(
        //         // tap(step => tou)
        //       )))))))];
        // return forkJoin(observables)
        return resumePage;
      }),
      // map((res: [HateoasPageResult<TournamentResume>, unknown]) => res[0])
    )
  }

  public getTournamentNavigationCursor(query?: GetParams<ITournamentNavigation, ITournamentsFilter>): PageCursor<ITournamentNavigation, ITournamentsFilter> {
    return new PageCursor<ITournamentNavigation, ITournamentsFilter>(
      this.getTournamentNavigationFiltered, {url: this.apiUrl, ...query}
    )
  }

  public getTournamentResumeCursor(query?: GetParams<TournamentResume, ITournamentsFilter>): PageCursor<TournamentResume, ITournamentsFilter> {
    return new PageCursor<TournamentResume, ITournamentsFilter>(
      this.getTournamentResumeFiltered, {url: this.apiUrl, ...query}
    )
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

  public getStep(tournamentId: string, stepId: string): Observable<ITournamentStepNavigation> {
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

}
