import { Router } from '@angular/router';
import { PortfolioService } from './../../services/portfolio.service';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  @Input() removeBookmarkEvent;
  storageService: LocalStorageService;
  loaded = false;
  watchList: {}[];
  watchListInfo: [];
  constructor(
    public storage: LocalStorageService,
    public portfolioService: PortfolioService,
    public router: Router
  ) {
    this.storageService = storage;
    this.watchList = storage.getBookmarks();
  }

  ngOnInit(): void {
    let tickerList = '';
    for (let stock of this.watchList) {
      tickerList = tickerList.concat(stock['ticker']).concat(',');
    }
    tickerList = tickerList.substring(0, tickerList.length - 1);
    this.portfolioService.getPortfolios(tickerList).subscribe((stocks: []) => {
      stocks.forEach((stock) => {
        let i;
        for (i = 0; i < this.watchList.length; i++) {
          if (this.watchList[i]['ticker'] == stock['ticker']) {
            this.watchList[i]['change'] = stock['change'];
            this.watchList[i]['changePercent'] = stock['changePercent'];
            this.watchList[i]['last'] = stock['last'];
            return;
          }
        }
      });
      this.loaded = true;
    });
  }

  removeBookmark(ticker) {
    this.storage.unsetBookmark(ticker);
    this.updateData();
  }

  public showDetails(ticker) {
    this.router.navigate(['/details', ticker]);
  }

  updateData() {
    this.loaded = false;
    this.watchList = this.storageService.getBookmarks();
    let tickerList = '';
    for (let stock of this.watchList) {
      tickerList = tickerList.concat(stock['ticker']).concat(',');
    }
    tickerList = tickerList.substring(0, tickerList.length - 1);
    this.portfolioService.getPortfolios(tickerList).subscribe((stocks: []) => {
      stocks.forEach((stock) => {
        let i;
        for (i = 0; i < this.watchList.length; i++) {
          if (this.watchList[i]['ticker'] == stock['ticker']) {
            this.watchList[i]['change'] = stock['change'];
            this.watchList[i]['changePercent'] = stock['changePercent'];
            this.watchList[i]['last'] = stock['last'];
            return;
          }
        }
      });
      this.loaded = true;
    });
  }
}
