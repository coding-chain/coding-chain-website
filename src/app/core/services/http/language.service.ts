import {Injectable} from "@angular/core";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {ApiHelperService} from "./api-helper.service";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GetParams} from "../../../shared/models/http/get.params";

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends ApiHelperService{
  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/languages`;


  public getById(id: string): Observable<IProgrammingLanguageNavigation | undefined>{
    return this.http.get<HateoasResponse<IProgrammingLanguageNavigation>| undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query: GetParams<IProgrammingLanguageNavigation>): PageCursor<IProgrammingLanguageNavigation,IProgrammingLanguageNavigation> {
    return new PageCursor<IProgrammingLanguageNavigation, IProgrammingLanguageNavigation>(
      this, {url: this.apiUrl, ...query}
    )
  }
}
