import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  private URL = constants.domain + '/highlights/';
  constructor(private http: HttpClient) {}

  getData(ticker: string): Observable<Object> {
    return this.http.get(this.URL + ticker);
  }
}

export class Highlight {
  ticker: string;
  name: string;
  exchangeCode: string;
  last: number;
  change: number;
  changePercent: number;
  currentTimestamp: string;
  marketStatus: number;
  lastTimestamp: string;
}

export class MarketChange {
  change: number;
  openStatus: number;
}
