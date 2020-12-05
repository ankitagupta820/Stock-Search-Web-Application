import { ChartService, Charts } from './../../services/chart.service';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';
import indicators from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';

indicators(Highcharts);
vbp(Highcharts);

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  @Input() ticker: string;
  @Input() marketChange: object;
  chartService: ChartService;
  chartData = new Charts();

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {
    rangeSelector: {
      selected: 2,
    },

    title: {
      text: 'title added in options',
    },

    subtitle: {
      text: 'With SMA and Volume by Price technical indicators',
    },

    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'OHLC',
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    plotOptions: {
      series: {
        dataGrouping: {
          units: [
            ['millisecond', [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
            ['second', [1, 2, 5, 10, 15, 30]],
            ['minute', [1, 2, 5, 10, 15, 30]],
            ['hour', [1, 2, 3, 4, 6, 8, 12]],
            ['day', [1]],
            ['week', [1]],
            ['month', [1, 3, 6]],
            ['year', null],
          ],
        },
      },
    },

    series: [
      {
        type: 'candlestick',
        name: 'AAPL',
        id: 'aapl',
        zIndex: 2,
        // data: [
        //   [122, 32, 32, 44, 54],
        //   [123, 33, 22, 11, 98],
        // ],
      },
      {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        yAxis: 1,
      },
      {
        type: 'vbp',
        params: {
          volumeSeriesID: 'volume',
        },
        dataLabels: {
          enabled: false,
        },
        zoneLines: {
          enabled: false,
        },
      },
      {
        type: 'sma',
        zIndex: 1,
        marker: {
          enabled: false,
        },
      },
    ],
  };

  constructor(service: ChartService) {
    this.chartService = service;
  }

  ngOnInit(): void {
    this.getCharts(this.ticker);
  }

  private getCharts(ticker) {
    this.chartService.geData(ticker).subscribe((results: Charts) => {
      this.chartData = { ...results };
      this.chartOptions.title['text'] =
        this.ticker.toUpperCase() + ' Historical';
      this.chartOptions.series[0]['data'] = results.OHLC;
      this.chartOptions.series[1]['data'] = results.Volume;
      this.chartOptions.series[0]['name'] = this.ticker;
      this.chartOptions.series[0]['id'] = this.ticker;
      this.chartOptions.series[2]['linkedTo'] = this.ticker;
      this.chartOptions.series[3]['linkedTo'] = this.ticker;
    });
  }
}
