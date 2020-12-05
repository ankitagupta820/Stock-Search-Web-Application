import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private Http: HttpClient;

  private Summary_URL = constants.domain + '/summary/';
  private Company_URL = constants.domain + '/summary/company/';
  private Chart_URL = constants.domain + '/summary/chart/';
  constructor(http: HttpClient) {
    this.Http = http;
    this.getSummaryData;
  }

  getSummaryData(ticker: string): Observable<Object> {
    return this.Http.get(this.Summary_URL + ticker);
  }

  getCompanyData(ticker: string): Observable<Object> {
    return this.Http.get(this.Company_URL + ticker);
  }

  getChartData(ticker: string): Observable<Object> {
    return this.Http.get(this.Chart_URL + ticker);
  }
}

export class Company {
  startDate: string;
  description: string;
}
export class Summary {
  marketStatus: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  close: number;
  mid: number;
  askPrice: number;
  askSize: number;
  bidPrice: number;
  bidSize: number;
}

export class Chart {
  marketStatus: number;
  change: number;
  chart: number[][];
}
