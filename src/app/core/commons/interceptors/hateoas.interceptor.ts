import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HateoasResponse} from '../../../shared/models/pagination/hateoas-response';
import {HateoasPageResponse} from '../../../shared/models/pagination/hateoas-page-response';

@Injectable()
export class HateoasInterceptor implements HttpInterceptor {


  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {

        if (event instanceof HttpResponse && event.body) {
          return event.clone({body: this.convertToHateoas(event.body)});
        }
        return event;
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
          }
        }
      }),
    );
  }

  convertToHateoas(body: any): HateoasResponse<any> | HateoasPageResponse<any> | any {
    if (body?.links && body?.result) {
      if (body?.total !== null && body?.total !== undefined) {
        return new HateoasPageResponse(body);
      }
      return new HateoasResponse(body);
    }
    return body;
  }


}
