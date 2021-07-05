import {Injectable} from '@angular/core';
import {IProgrammingLanguage, IProgrammingLanguageNavigation} from '../../../shared/models/programming-languages/responses';
import {ApiHelperService, HateoasPageResult} from './api-helper.service';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PageCursor} from '../../../shared/models/pagination/page-cursor';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {GetParams} from '../../../shared/models/http/get.params';
import {toProgrammingLanguage} from '../../../shared/utils/languages.utils';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends ApiHelperService {
  protected apiUrl = `${environment.apiUrl}/languages`;

  constructor(http: HttpClient) {
    super(http);
    this.getLanguagesFiltered = this.getLanguagesFiltered.bind(this);
  }


  public getById(id: string): Observable<IProgrammingLanguage | undefined> {
    return this.http.get<HateoasResponse<IProgrammingLanguageNavigation> | undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => toProgrammingLanguage(res.result))
      );
  }

  public getLanguagesFiltered(obj: GetParams<IProgrammingLanguageNavigation>)
    : Observable<HateoasPageResult<IProgrammingLanguage>> {
    return this.getFiltered<IProgrammingLanguage, IProgrammingLanguageNavigation, IProgrammingLanguageNavigation>(obj).pipe(map(page => {
      const languages = page.result.map(language => toProgrammingLanguage(language.result));
      return page.clone(languages, (pageElement, subElement) => pageElement.result.id === subElement.id);
    }));
  }

  public getCursor(query: GetParams<IProgrammingLanguageNavigation>): PageCursor<IProgrammingLanguage, IProgrammingLanguageNavigation> {
    return new PageCursor<IProgrammingLanguage, IProgrammingLanguageNavigation>(
      this.getLanguagesFiltered, {url: this.apiUrl, ...query}
    );
  }

  public getAll(): Observable<IProgrammingLanguage[]> {
    return this.fetchAll<IProgrammingLanguageNavigation>({url: this.apiUrl})
      .pipe(
        map(languages => languages.map(l => toProgrammingLanguage(l.result)))
      );
  }
}
