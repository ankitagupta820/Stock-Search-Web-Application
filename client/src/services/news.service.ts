import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private URL: string;
  constructor(private http: HttpClient) {}

  getData(ticker: string): Observable<Object> {
    this.URL = constants.domain + '/news/' + ticker;
    return this.http.get(this.URL);
  }
}

export interface News {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  content: string;
}
