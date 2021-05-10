import { Injectable } from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable, of} from "rxjs";
import {IProgrammingLanguageNavigation} from "../../../shared/models/programming-languages/responses";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {MapOperator} from "rxjs/src/internal/operators/map";
import {GetProgrammingLanguagesNavigationsPaginated} from "../../../shared/models/programming-languages/queries";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";

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

  public getCursor(query: GetProgrammingLanguagesNavigationsPaginated): PageCursor<IProgrammingLanguageNavigation, GetProgrammingLanguagesNavigationsPaginated>{

    return new PageCursor<IProgrammingLanguageNavigation, GetProgrammingLanguagesNavigationsPaginated>(
      this, {filterObj: query, url: this.apiUrl}
    )
  }
}
