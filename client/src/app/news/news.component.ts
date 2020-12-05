import { NewsService, News } from './../../services/news.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  @Input() ticker: string;
  private newsService: NewsService;
  public news;
  closeResult = '';

  constructor(service: NewsService, private modalService: NgbModal) {
    this.newsService = service;
  }

  ngOnInit(): void {
    this.getNews(this.ticker);
  }

  getNews(ticker) {
    this.newsService.getData(ticker).subscribe((results: News) => {
      this.news = results;
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  encode(url: string) {
    return encodeURIComponent(url);
  }
}
