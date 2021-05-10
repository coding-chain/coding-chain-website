import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiCommonService } from './api-common.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends ApiCommonService{

  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/participations`;


}
