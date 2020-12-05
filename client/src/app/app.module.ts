import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DetailsComponent } from './details/details.component';
import { HighlightComponent } from './highlight/highlight.component';
import { SummaryComponent } from './summary/summary.component';
import { ChartComponent } from './chart/chart.component';
import { NewsComponent } from './news/news.component';

import { ChartService } from '../services/chart.service';
import { NewsService } from './../services/news.service';
import { SummaryService } from './../services/summary.service';
import { HighlightService } from './../services/highlight.service';
import { LocalStorageService } from './../services/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    HighlightComponent,
    SummaryComponent,
    ChartComponent,
    HighlightComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HighchartsChartModule,
    NgbModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    HighlightService,
    SummaryService,
    NewsService,
    ChartService,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
