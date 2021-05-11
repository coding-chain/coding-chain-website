import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {IParticipationNavigation} from "../../../shared/models/participations/responses";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {GetParams} from "../../../shared/models/http/get.params";
import {ICreateParticipationCommand} from "../../../shared/models/participations/commands";

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends ApiHelperService {

  protected apiUrl = `${environment.apiUrl}/participations`;

  constructor(http: HttpClient) {
    super(http);
    this.getParticipationNavigationFiltered = this.getParticipationNavigationFiltered.bind(this);
  }

  public getParticipationNavigationFiltered(obj: GetParams<IParticipationNavigation>):Observable<HateoasPageResult<IParticipationNavigation>> {
    return this.getFiltered(obj);
  }
  public getById(id: string): Observable<IParticipationNavigation | undefined> {
    return this.http.get<HateoasResponse<IParticipationNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query: GetParams<IParticipationNavigation>): PageCursor<IParticipationNavigation,IParticipationNavigation> {
    return new PageCursor<IParticipationNavigation, IParticipationNavigation>(
      this.getParticipationNavigationFiltered, {url: this.apiUrl, ...query}
    )
  }

  public createOne(body: ICreateParticipationCommand): Observable<IParticipationNavigation>{
    return this.createAndGet<ICreateParticipationCommand, HateoasResponse<IParticipationNavigation>>(this.apiUrl, body)
      .pipe(
        map(res => res.result)
      );
  }

}
