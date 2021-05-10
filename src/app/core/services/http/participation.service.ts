import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiHelperService } from './api-helper.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService extends ApiHelperService{

  constructor(http: HttpClient) {
    super(http);
  }

  protected apiUrl = `${environment.apiUrl}/participations`;



}
