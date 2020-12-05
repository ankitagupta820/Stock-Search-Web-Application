import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private URL = constants.domain + '/ticker/';
  constructor(private http: HttpClient) {}

  isValid(ticker: string): Observable<Object> {
    return this.http.get(this.URL + ticker);
  }
}
