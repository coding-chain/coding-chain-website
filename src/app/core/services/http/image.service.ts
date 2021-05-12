import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  getData(url: string): Observable<string> {
    return this.http.get(url, {responseType: 'blob'})
      .pipe(
        switchMap(response => this.readFile(response))
      );
  }

  saveFile(url: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  private readFile(blob: Blob): Observable<string> {
    return new Observable(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result.toString());
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }

}
