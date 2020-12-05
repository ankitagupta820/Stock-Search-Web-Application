import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../services/constants';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchCtrl = new FormControl();
  filteredTicker: any;
  isLoading = false;

  constructor(public router: Router, public http: HttpClient) {}

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredTicker = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.http
            .get(constants.domain + '/autocomplete/?ticker=' + value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe(
        (data) => {
          if (data == undefined) {
            this.filteredTicker = [];
          } else {
            this.filteredTicker = data;
          }
        },
        (err) => {
          console.log(
            err.status +
              ': ' +
              err.statusText +
              ' encountered while fetching results for autocomplete.'
          );
        }
      );
  }

  displayFn(entry: string): string {
    return entry;
  }

  onSubmit() {
    let ticker = this.searchCtrl.value;
    if (ticker != '') {
      this.router.navigate(['/details', ticker]);
    }
  }
}
