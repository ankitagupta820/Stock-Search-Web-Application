import {
  SummaryService,
  Summary,
  Company,
  Chart,
} from './../../services/summary.service';
import {
  HighlightService,
  Highlight,
} from './../../services/highlight.service';
import { UtilsService } from './../../services/utils.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'highcharts/highstock';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  public ticker: string;
  public valid: boolean;
  public loaded: boolean = false;
  public highlights: Highlight;
  public summary: Summary;
  public company: Company;
  public chartOptions: Options;
  constructor(
    private route: ActivatedRoute,
    public utilService: UtilsService,
    public highlightService: HighlightService,
    public summaryService: SummaryService
  ) {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
  }

  ngOnInit(): void {
    this.utilService.isValid(this.ticker).subscribe((result) => {
      this.valid = result['Validity'];
      if (this.valid == false) {
        this.loaded = true;
      } else {
        this.getHighlightData();
        this.getSummaryData();
        this.getCompanyData();
        this.getChartData();
        this.loaded = true;
      }
    });
  }

  getHighlightData() {
    this.highlightService
      .getData(this.ticker)
      .subscribe((results: Highlight) => {
        this.highlights = { ...results };
      });
  }

  getSummaryData() {
    this.summaryService
      .getSummaryData(this.ticker)
      .subscribe((results: Summary) => {
        this.summary = { ...results };
      });
  }

  getCompanyData() {
    this.summaryService
      .getCompanyData(this.ticker)
      .subscribe((results: Company) => {
        this.company = { ...results };
      });
  }

  getChartData() {
    this.summaryService
      .getChartData(this.ticker)
      .subscribe((results: Chart) => {
        this.configureChartOptions(results);
      });
  }

  configureChartOptions(results) {
    let chartOptions: Options = {
      title: {
        style: {
          color: 'gray',
        },
      },
      rangeSelector: {
        enabled: false,
      },
      time: {
        useUTC: false,
      },
      series: [
        {
          type: 'line',
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    };

    chartOptions.title['text'] = this.ticker.toUpperCase();
    let color = results.change < 0 ? 'red' : 'green';
    chartOptions.series[0]['color'] = color;
    chartOptions.series[0]['data'] = results.chart;
    chartOptions.series[0]['tooltip']['pointFormat'] =
      '<span style="color:' +
      color +
      '">●</span> ' +
      this.ticker.toUpperCase() +
      ': <b>{point.y}</b><br/>';

    this.chartOptions = chartOptions;
  }
}
