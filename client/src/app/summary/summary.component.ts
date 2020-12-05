import {
  SummaryService,
  Summary,
  Company,
  Chart,
} from './../../services/summary.service';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ticker: string;
  @Input() summary = new Summary();
  @Input() company = new Company();
  @Input() chartOptions: Options;

  private summaryService: SummaryService;
  refreshInterval;

  Highcharts: typeof Highcharts = Highcharts;

  constructor(service: SummaryService) {
    this.summaryService = service;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['summary'] && this.summary != null) {
      if (this.summary.marketStatus == 1) {
        this.refreshInterval = setInterval(() => {
          this.getSummary();
          this.getChart();
        }, 15000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getSummary() {
    this.summaryService
      .getSummaryData(this.ticker)
      .subscribe((results: Summary) => {
        this.summary = { ...results };
      });
  }

  getChart() {
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
