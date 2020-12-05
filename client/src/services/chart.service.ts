import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private URL = constants.domain + '/charts/';
  constructor(private http: HttpClient) {}

  geData(ticker: string): Observable<Object> {
    return this.http.get(this.URL + ticker);
  }
}

export class Charts {
  OHLC: [string | number, number, number, number][];
  Volume: [string | number, number][];
}
