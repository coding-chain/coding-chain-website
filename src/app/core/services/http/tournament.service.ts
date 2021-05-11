import {Injectable} from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
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

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends ApiHelperService{
  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/tournaments`;


  public getById(id: string): Observable<ITournamentNavigation | undefined> {
    return this.http.get<HateoasResponse<ITournamentNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query?: GetParams<ITournamentNavigation, ITournamentsFilter>): PageCursor<ITournamentNavigation, ITournamentsFilter> {
    return new PageCursor<ITournamentNavigation,  ITournamentsFilter>(
      this, {url: this.apiUrl, ...query}
    )
  }


  public createOne(body: ICreateTournamentCommand): Observable<ITournamentNavigation>{
    return this.createAndGet<ICreateTournamentCommand, HateoasResponse<ITournamentNavigation>>(`${this.apiUrl}`, body)
      .pipe(
        map(res => res.result)
      );
  }

  public deleteOne(tournamentId: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${tournamentId}`);
  }

  public updateOne(tournamentId: string, body: IUpdateTournamentCommand): Observable<any>{
    return this.http.put(`${this.apiUrl}/${tournamentId}`, body);
  }

  public updateSteps(tournamentId: string, body: ISetTournamentStepsCommand): Observable<any>{
    return this.http.put(`${this.apiUrl}/${tournamentId}`, body);
  }

  public deleteStep(tournamentId: string, stepId: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${tournamentId}/steps/${stepId}`);
  }

  public getStep(tournamentId: string, stepId: string): Observable<ITournamentStepNavigation>{
    return this.http.get<HateoasResponse<ITournamentStepNavigation>>(`${this.apiUrl}/${tournamentId}/steps/${stepId}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getStepsCursor(tournamentId: string, query: GetParams<ITournamentStepNavigation>): PageCursor<ITournamentStepNavigation, ITournamentStepNavigation>{
    return new PageCursor<ITournamentStepNavigation, ITournamentStepNavigation>(this, {url: `${this.apiUrl}/${tournamentId}`, ...query});
  }




}
