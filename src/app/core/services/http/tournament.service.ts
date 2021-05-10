import { Injectable } from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ITestNavigation} from "../../../shared/models/tests/responses";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {GetTestNavigationsPaginated} from "../../../shared/models/tests/queries";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {GetTournamentNavigationsPaginated} from "../../../shared/models/tournaments/queries";

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

  public getCursor(query: GetTournamentNavigationsPaginated): PageCursor<ITournamentNavigation, GetTournamentNavigationsPaginated> {
    return new PageCursor<ITournamentNavigation, GetTournamentNavigationsPaginated>(
      this, {url: this.apiUrl, ...query}
    )
  }
}
