import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { PortfolioService } from './../../services/portfolio.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Alert from '../../services/AlertInterface';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  alerts: Alert[];
  Math: any;
  portfolio;
  quantity = 0;
  loaded: boolean = false;
  BUY = 'buy';
  SELL = 'sell';

  constructor(
    public storage: LocalStorageService,
    public portfolioService: PortfolioService,
    public modalService: NgbModal,
    public router: Router
  ) {
    this.portfolio = storage.getPurchases();
    this.Math = Math;
  }

  ngOnInit(): void {
    let tickerList = '';
    for (let stock of this.portfolio) {
      tickerList = tickerList.concat(stock[0]).concat(',');
    }
    tickerList = tickerList.substring(0, tickerList.length - 1);

    this.portfolioService.getPortfolios(tickerList).subscribe((stocks: []) => {
      stocks.forEach((stock) => {
        let i;
        for (i = 0; i < this.portfolio.length; i++) {
          if (this.portfolio[i][0] == stock['ticker']) {
            this.portfolio[i][1]['change'] = stock['change'];
            this.portfolio[i][1]['last'] = stock['last'];
            return;
          }
        }
      });
      this.loaded = true;
    });
  }

  openModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'Buy Stock',
    });
  }

  closeModal(ticker: string, qty: number, name?: string, price?: number) {
    if (price) {
      this.storage.buy(ticker, name, qty, price);
      this.quantity = 0;
    } else {
      this.storage.sell(ticker, qty);
      this.quantity = 0;
    }
    this.modalService.dismissAll();
    this.portfolio = this.storage.getPurchases();
    this.updateData();
  }

  addAlert(alert: Alert) {
    this.alerts.unshift(alert);
    setTimeout(() => {
      this.alerts.pop();
    }, 5000);
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  public showDetails(ticker: string) {
    this.router.navigate(['/details', ticker]);
  }

  updateData() {
    let tickerList = '';
    for (let stock of this.portfolio) {
      tickerList = tickerList.concat(stock[0]).concat(',');
    }
    tickerList = tickerList.substring(0, tickerList.length - 1);

    this.portfolioService.getPortfolios(tickerList).subscribe((stocks: []) => {
      stocks.forEach((stock) => {
        let i;
        for (i = 0; i < this.portfolio.length; i++) {
          if (this.portfolio[i][0] == stock['ticker']) {
            this.portfolio[i][1]['change'] = stock['change'];
            this.portfolio[i][1]['last'] = stock['last'];
            return;
          }
        }
      });
    });
  }
}
