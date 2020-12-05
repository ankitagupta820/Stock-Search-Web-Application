import {
  HighlightService,
  Highlight,
  MarketChange,
} from './../../services/highlight.service';
import AlertInterface from '../../services/AlertInterface';
import { LocalStorageService } from './../../services/local-storage.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit, OnDestroy {
  @Input() ticker: string;
  @Input() highlights = new Highlight();

  public alerts: AlertInterface[] = [];
  private highlightService: HighlightService;
  private storage: LocalStorageService;
  public quantity: number = 0;

  bookmarked: boolean;

  interval;

  constructor(
    service: HighlightService,
    storage: LocalStorageService,
    private modalService: NgbModal
  ) {
    this.highlightService = service;
    this.storage = storage;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['highlights'] && this.highlights) {
      this.bookmarked = this.storage.isBookmarked(this.ticker);
      if (this.highlights.marketStatus == 1) {
        this.interval = setInterval(() => {
          this.getHighlights();
        }, 15000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getHighlights() {
    this.highlightService
      .getData(this.ticker)
      .subscribe((results: Highlight) => {
        this.highlights = { ...results };
      });
  }

  toggleBookmark() {
    let ticker = this.highlights.ticker;
    this.bookmarked = !this.bookmarked;
    if (this.storage.isBookmarked(ticker)) {
      this.storage.unsetBookmark(ticker);
      this.addAlert({
        type: 'danger',
        message: ticker + ' removed from Watchlist',
      });
    } else {
      this.storage.setBookmark(ticker, this.highlights.name);
      this.addAlert({
        type: 'success',
        message: this.highlights.ticker + ' added to Watchlist',
      });
    }
  }

  //Modal
  openModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'Buy Stock',
    });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.addAlert({
      type: 'success',
      message: this.highlights.ticker + ' bought successfully!',
    });
    this.storage.buy(
      this.highlights.ticker,
      this.highlights.name,
      this.quantity,
      this.highlights.last
    );
    this.quantity = 0;
  }

  //Alerts
  addAlert(alert: AlertInterface) {
    this.alerts.unshift(alert);
    setTimeout(() => {
      this.alerts.pop();
    }, 5000);
  }

  closeAlert(alert: AlertInterface) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
