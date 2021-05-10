import { Injectable } from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {IStepNavigation} from "../../../shared/models/steps/responses";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {GetStepsNavigationsPaginated} from "../../../shared/models/steps/queries";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {ITestNavigation} from "../../../shared/models/tests/responses";
import {GetTestNavigationsPaginated} from "../../../shared/models/tests/queries";

@Injectable({
  providedIn: 'root'
})
export class TestService extends ApiHelperService{
  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/tests`;

  public getById(id: string): Observable<ITestNavigation | undefined> {
    return this.http.get<HateoasResponse<ITestNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query: GetTestNavigationsPaginated): PageCursor<ITestNavigation, GetTestNavigationsPaginated> {
    return new PageCursor<ITestNavigation, GetTestNavigationsPaginated>(
      this, {url: this.apiUrl, ...query}
    )
  }
}
