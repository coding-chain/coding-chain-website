import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map, switchMap} from 'rxjs/operators';
import {IParticipationNavigation} from '../../../shared/models/participations/responses';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {GetParams} from '../../../shared/models/http/get.params';
import {ICreateParticipationCommand} from '../../../shared/models/participations/commands';
import {IParticipationFilter} from '../../../shared/models/participations/filters';
import {TournamentService} from './tournament.service';
import {ITournamentNavigation} from '../../../shared/models/tournaments/responses';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends ApiHelperService {

  protected apiUrl = `${environment.apiUrl}/participations`;

  constructor(http: HttpClient, private readonly _tournamentService: TournamentService) {
    super(http);
    this.getParticipationNavigationPaginatedFiltered = this.getParticipationNavigationPaginatedFiltered.bind(this);
  }

  public getParticipationNavigationPaginatedFiltered(obj: GetParams<IParticipationNavigation, IParticipationFilter>)
    : Observable<HateoasPageResult<IParticipationNavigation>> {
    return this.getFiltered(obj);
  }

  public getAllParticipationNavigationFiltered(obj: GetParams<IParticipationNavigation, IParticipationFilter>)
    : Observable<IParticipationNavigation[]> {
    return this.fetchAll<IParticipationNavigation, IParticipationNavigation, IParticipationFilter>({url: this.apiUrl, ...obj}).pipe(
      map(participations => participations.map(p => p.result))
    );
  }

  public getById(id: string): Observable<IParticipationNavigation | undefined> {
    return this.http.get<HateoasResponse<IParticipationNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      );
  }

  public getTournamentNavigationByParticipationId(id: string): Observable<ITournamentNavigation | undefined> {
    return this.http.get<HateoasResponse<IParticipationNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        switchMap(res => this._tournamentService.getById(res.result.tournamentId))
      );
  }


  public getCursor(query: GetParams<IParticipationNavigation, IParticipationFilter>)
    : PageCursor<IParticipationNavigation, IParticipationFilter> {
    return new PageCursor<IParticipationNavigation, IParticipationFilter>(
      this.getParticipationNavigationPaginatedFiltered, {url: this.apiUrl, ...query}
    );
  }

  public createOne(body: ICreateParticipationCommand): Observable<IParticipationNavigation> {
    return this.createAndGet<ICreateParticipationCommand, HateoasResponse<IParticipationNavigation>>(this.apiUrl, body)
      .pipe(
        map(res => res.result)
      );
  }

  public createOneAndGetId(body: ICreateParticipationCommand): Observable<string> {
    return this.createAndGetIds(this.apiUrl, body)
      .pipe(
        map(ids => ids.pop())
      );
  }


}
