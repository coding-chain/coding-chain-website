import { Injectable } from '@angular/core';
import {ApiHelperService} from "./api-helper.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HateoasResponse} from "../../../shared/models/pagination/hateoas-response";
import {map} from "rxjs/operators";
import {GetParams} from "../../../shared/models/http/get.params";
import {PageCursor} from "../../../shared/models/pagination/page-cursor";
import {RightNavigation} from "../../../shared/models/rights/responses";


@Injectable({
  providedIn: 'root'
})
export class RightService extends ApiHelperService{
  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/rights`;


  public getById(id: string): Observable<RightNavigation | undefined>{
    return this.http.get<HateoasResponse<RightNavigation>| undefined>(`${this.apiUrl}/${id}`)
      .pipe(
        map(res => res.result)
      )
  }

  public getCursor(query: GetParams<RightNavigation>): PageCursor<RightNavigation,RightNavigation> {
    return new PageCursor<RightNavigation, RightNavigation>(
      this, {url: this.apiUrl, ...query}
    )
  }
}
