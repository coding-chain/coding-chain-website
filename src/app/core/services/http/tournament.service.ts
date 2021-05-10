import {Injectable} from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {ITournamentNavigation} from "../../../shared/models/tournaments/responses";
import {GetParams} from "../../../shared/models/http/get.params";

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

  public getCursor(query: GetParams<ITournamentNavigation>): PageCursor<ITournamentNavigation,ITournamentNavigation> {
    return new PageCursor<ITournamentNavigation, ITournamentNavigation>(
      this, query
    )
  }
}
