import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private URL;
  constructor(public http: HttpClient) {}

  getPortfolios(tickers: string): Observable<Object> {
    this.URL = constants.domain + '/portfolio/?tickers=' + tickers;
    return this.http.get(this.URL);
  }
}
