import { Injectable } from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {GetParticipationNavigationsPaginated} from "../../../shared/models/participations/queries";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {IStepNavigation} from "../../../shared/models/steps/responses";
import {GetStepsNavigationsPaginated} from "../../../shared/models/steps/queries";

@Injectable({
  providedIn: 'root'
})
export class StepService extends ApiHelperService{
  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/steps`;

  public getById(id: string): Observable<IStepNavigation | undefined> {
    return this.http.get<HateoasResponse<IStepNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query: GetStepsNavigationsPaginated): PageCursor<IStepNavigation, GetStepsNavigationsPaginated> {
    return new PageCursor<IStepNavigation, GetStepsNavigationsPaginated>(
      this, {url: this.apiUrl, ...query}
    )
  }
}
