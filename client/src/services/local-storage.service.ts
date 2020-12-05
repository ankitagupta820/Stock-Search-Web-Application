import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  localStorage: Storage;
  BOOKMARKS = 'BOOKMARKS';
  PURCHASE = 'PURCHASE';

  constructor() {
    this.localStorage = window.localStorage;
  }

  isBookmarked(ticker: string): boolean {
    let bookmarks: string = this.localStorage.getItem(this.BOOKMARKS);
    if (bookmarks) {
      let set = JSON.parse(bookmarks);
      for (let stock of set) {
        if (stock.ticker == ticker.toUpperCase()) {
          return true;
        }
      }
    }
    return false;
  }

  setBookmark(ticker: string, name: string) {
    let bookmarks: string = this.localStorage.getItem(this.BOOKMARKS);
    let set;
    if (bookmarks) {
      set = JSON.parse(bookmarks);
      set.push({ ticker: ticker, name: name });
    } else {
      set = new Array();
      set.push({ ticker: ticker, name: name });
    }
    this.localStorage.setItem(this.BOOKMARKS, JSON.stringify(set));
  }

  unsetBookmark(ticker: string) {
    let bookmarks: string = this.localStorage.getItem(this.BOOKMARKS);
    let set, status: boolean;
    if (bookmarks) {
      set = JSON.parse(bookmarks);
      let i;
      for (i = 0; i < set.length; i++) {
        if (set[i].ticker == ticker) {
          status = true;
          break;
        }
      }
      set.splice(i, 1);
    } else {
      status = false;
    }
    this.localStorage.setItem(this.BOOKMARKS, JSON.stringify(set));
    return status;
  }

  getBookmarks() {
    let bookmarks: string = localStorage.getItem(this.BOOKMARKS);
    let set;
    if (bookmarks) {
      set = JSON.parse(bookmarks);
      return set;
    } else {
      return [];
    }
  }

  isBought(ticker: string) {
    let purchase: string = this.localStorage.getItem(this.PURCHASE);
    if (purchase) {
      let map = JSON.parse(purchase);
      map.forEach((element) => {
        if (element.ticker == ticker) {
          return true;
        }
      });
    }
    return false;
  }

  sell(ticker: string, qty: number) {
    let purchase: string = this.localStorage.getItem(this.PURCHASE);
    let map;
    if (purchase) {
      map = JSON.parse(purchase);
      if (map[ticker]) {
        let stock = map[ticker];
        if (stock.qty - qty == 0) {
          delete map[ticker];
        } else {
          let avg = stock.price / stock.qty;
          stock.price = stock.price - qty * avg;
          stock.qty = stock.qty - qty;
          map[ticker] = stock;
        }
        this.localStorage.setItem(this.PURCHASE, JSON.stringify(map));
        return true;
      }
    }
    return false;
  }

  getPurchases() {
    let purchase: string = this.localStorage.getItem(this.PURCHASE);
    let map;
    if (purchase) {
      map = JSON.parse(purchase);
      return Object.entries(map);
    } else {
      return [];
    }
  }

  buy(ticker: string, name: string, qty: number, price: number) {
    let purchases: string = this.localStorage.getItem(this.PURCHASE);
    let map;
    if (purchases) {
      map = JSON.parse(purchases);
      if (map[ticker]) {
        let stock = map[ticker];
        stock.qty = stock.qty + qty;
        stock.price = stock.price + qty * price;
        map[ticker] = stock;
      } else {
        let stock = { qty: qty, price: price * qty, name: name };
        map[ticker] = stock;
      }
    } else {
      map = {
        [ticker]: {
          qty: qty,
          price: price * qty,
          name: name,
        },
      };
    }
    this.localStorage.setItem(this.PURCHASE, JSON.stringify(map));
  }
}
