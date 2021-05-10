import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ApiHelperService} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {IParticipationNavigation} from "../../../shared/models/participations/responses";
import {GetProgrammingLanguagesNavigationsPaginated} from "../../../shared/models/programming-languages/queries";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {GetParticipationNavigationsPaginated} from "../../../shared/models/participations/queries";

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends ApiHelperService {

  protected apiUrl = `${environment.apiUrl}/participations`;

  constructor(http: HttpClient) {
    super(http);
  }

  public getById(id: string): Observable<IParticipationNavigation | undefined> {
    return this.http.get<HateoasResponse<IParticipationNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query: GetParticipationNavigationsPaginated): PageCursor<IParticipationNavigation, GetParticipationNavigationsPaginated> {
    return new PageCursor<IParticipationNavigation, GetParticipationNavigationsPaginated>(
      this, {url: this.apiUrl, ...query}
    )
  }
}
