import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { RequestService } from '@app/core/request.service';
import { Title } from '@angular/platform-browser';

const monthMap: Map<number, string> = new Map([
  [0, 'January'],
  [1, 'February'],
  [2, 'March'],
  [3, 'April'],
  [4, 'May'],
  [5, 'June'],
  [6, 'July'],
  [7, 'August'],
  [8, 'September'],
  [9, 'October'],
  [10, 'November'],
  [11, 'December']
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  uptimesColorScheme = {
    domain: ['#1e75b5', '#488aba', '#6c97b7', '#8ba3b5']
  };

  responseColorScheme = {
    domain: ['#289b22', '#549e50', '#6b9e68', '#839e81']
  };

  uptimeCardsColorScheme: object = {
    domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
  };

  uptimeCardsColorScheme_2: object = {
    domain: ['#967cba', '#4e9388', '#5e9cd6', '#aa313f', '#b78356', '#929e52']
  };

  responseCardsColorScheme: object = {
    domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
  };

  responseCardsColorScheme_2: object = {
    domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
  };

  cardsColorScheme = {
    domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
  };

  slaColorScheme = {
    domain: ['#0042ad', '#e28400', '#ad0000']
  };

  missesColorScheme = {
    domain: ['#1e75b5', '#289b22']
  };

  thresholdColorScheme = {
    domain: ['#1e75b5', '#289b22']
  };

  //Data Chart Color Schemes

  uptimesChartColorScheme = {
    domain: ['#1e75b5', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  responseChartColorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  client: object;
  clients: object[];
  applications: object[];

  client_id: string;
  application_id: string;
  application: object;

  uptimes_data: object;
  response_data: object;

  current_uptimes_ratio: number;

  end_date: string;
  choice: string;
  current_date: string;
  current_month: string;
  current_year: string;

  uptimes_ratio_gauge_data: object[];
  response_times_gauge_data: object[];
  number_cards_data: object[] = [];
  sla_status_chart_data: object[];
  sla_misses_chart_data: object[];
  sla_threshold_chart_data: object[];

  uptimes_ratio_chart_data: object[];
  response_times_chart_data: object[];
  uptimes_number_cards_data: object[];
  uptimes_number_cards_data_2: object[];
  response_number_cards_data: object[];
  response_number_cards_data_2: object[];

  requirements_cards_view: number[] = [300, 200];

  response_compliance: boolean;
  uptime_compliance: boolean;

  displayUptimeRequirements: boolean = false;
  displayResponseRequirements: boolean = false;

  uptime_requirements_gauge_options: object = {
    units: '%'
  };

  sla_status_chart_options: object = {
    view: [800, 250],
    label: 'Total Days'
  };

  sla_misses_chart_options: object = {
    view: [350, 300],
    xAxis: true,
    yAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'Requirement Type',
    yAxisLabel: 'Days Not Compliant'
  };

  sla_threshold_chart_options: object = {
    view: [350, 300],
    xAxis: true,
    yAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    xAxisLabel: 'Requirement Type',
    yAxisLabel: 'Days At Threshold'
  };

  uptimes_ratio_gauge_options: object = {
    view: [700, 300],
    min: 0,
    max: 100,
    units: '(%)'
  };

  response_times_gauge_options: object = {
    view: [700, 300],
    min: 0,
    max: 100,
    units: '(ms)'
  };

  number_cards_options: object = {
    view: [700, 300],
    cardColor: '#595b5e',
    textColor: '#efefef'
  };

  uptimes_chart_options: object = {
    view: [700, 350],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Timeslice End',
    showYAxisLabel: true,
    yAxisLabel: 'Uptime Ratio (%)',
    timeline: true,
    autoScale: false,
    yScaleMin: 0,
    yScaleMax: 100
  };

  response_times_data_chart_options: object = {
    view: [700, 450],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Test Time',
    showYAxisLabel: true,
    yAxisLabel: 'Response Time (ms)',
    timeline: true,
    yScaleMax: 1000,
    autoScale: false
  };

  uptimes_number_cards_options: object = {
    cardColor: '#595b5e',
    textColor: '#efefef',
    textColor_2: '#efefef'
  };

  response_number_cards_options: object = {
    cardColor: '#595b5e',
    textColor: '#efefef',
    textColor_2: '#efefef'
  };

  uptime_linear_options: object = {
    view: [240, 100],
    value: 60,
    previousValue: 80,
    units: '%',
    scheme: {
      domain: ['#1e75b5']
    }
  };

  response_linear_options: object = {
    view: [240, 100],
    value: 60,
    max: 1500,
    previousValue: 80,
    units: 'ms',
    scheme: {
      domain: ['#1e75b5']
    }
  };

  constructor(private requestService: RequestService, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Dashboard');

    this.requestService.getClients().subscribe(response => {
      if (response['Successful']) {
        this.clients = response['Data'];
        if (this.applications) {
          this.associate();
        }
      }
    });

    this.requestService.getApplications().subscribe(response => {
      //console.log(response);
      if (response['Successful']) {
        this.applications = response['Data'];
        if (this.clients) {
          this.associate();
        }
      }
    });
  }

  displayData(): void {
    for (let application of this.applications) {
      if (this.application_id == application['id']) {
        console.log(application['uptimes']);
        this.application = application;
        this.uptimes_data = application['uptimes'];
        this.response_data = application['response_times'];

        break;
      }
    }

    this.uptime_linear_options['previousValue'] = this.application['uptime_requirements'][0]['target_value'];
    this.response_linear_options['previousValue'] = this.application['response_time_requirements'][0]['target_value'];

    this.displayUptimes();
    this.displayResponseTimes();
    this.displayStatus();
  }

  displayUptimes(): void {
    if (!this.uptimes_data) {
      return;
    }

    let total_uptime = 0;
    let total_downtime = 0;
    let total_unmonitored = 0;
    let start_date = null;

    let current_date = new Date();

    let date_fields = [current_date.getMonth(), current_date.getDate(), current_date.getFullYear()];
    console.log(date_fields);
    let start_date_fields = [current_date.getMonth(), 1, current_date.getFullYear()];

    let uptimes_data = [];
    let uptimes_raw_data = [];
    let downtimes_raw_data = [];
    let unmonitored_raw_data = [];

    let requirements_target_data = [];
    let requirements_threshold_data = [];

    let uptime_ratio: number;

    this.uptimes_number_cards_data = [];
    this.uptimes_number_cards_data_2 = [];

    for (let i = start_date_fields[1] - 1; i < date_fields[1]; i++) {
      let entry = this.uptimes_data['data'][date_fields[0]][i];
      if (entry != null && new Date(entry['start_time'] * 1000).getFullYear() == new Date().getFullYear()) {
        if (start_date == null) {
          start_date = new Date(entry['start_time'] * 1000);
          //this.uptimes_chart_options['yAxisLabel'] = "Uptime Ratio Since " + start_date.toDateString() + " [%]";
        }
        let end_date = new Date(entry['end_time'] * 1000);

        total_uptime = total_uptime + entry['uptime'];
        total_downtime = total_downtime + entry['downtime'];
        total_unmonitored = total_unmonitored + entry['unmonitored'];

        uptime_ratio = (total_uptime / (total_downtime + total_uptime)) * 100.0;

        uptimes_data.push({
          name:
            end_date.getFullYear() +
            '-' +
            end_date.getMonth() +
            '-' +
            end_date.getDate() +
            'T' +
            this.pad(end_date.getHours()) +
            ':' +
            this.pad(end_date.getMinutes()) +
            ':' +
            this.pad(end_date.getSeconds()) +
            '.000Z',
          value: Number.parseFloat(uptime_ratio.toFixed(2))
        });

        requirements_target_data.push({
          name:
            end_date.getFullYear() +
            '-' +
            end_date.getMonth() +
            '-' +
            end_date.getDate() +
            'T' +
            this.pad(end_date.getHours()) +
            ':' +
            this.pad(end_date.getMinutes()) +
            ':' +
            this.pad(end_date.getSeconds()) +
            '.000Z',
          value: this.application['uptime_requirements'][0]['target_value']
        });

        requirements_threshold_data.push({
          name:
            end_date.getFullYear() +
            '-' +
            end_date.getMonth() +
            '-' +
            end_date.getDate() +
            'T' +
            this.pad(end_date.getHours()) +
            ':' +
            this.pad(end_date.getMinutes()) +
            ':' +
            this.pad(end_date.getSeconds()) +
            '.000Z',
          value: this.application['uptime_requirements'][0]['target_threshold']
        });

        uptimes_raw_data.push({
          name:
            end_date.getFullYear() +
            '-' +
            end_date.getMonth() +
            '-' +
            end_date.getDate() +
            'T' +
            this.pad(end_date.getHours()) +
            ':' +
            this.pad(end_date.getMinutes()) +
            ':' +
            this.pad(end_date.getSeconds()) +
            '.000Z',
          value: total_uptime
        });

        downtimes_raw_data.push({
          name:
            end_date.getFullYear() +
            '-' +
            end_date.getMonth() +
            '-' +
            end_date.getDate() +
            'T' +
            this.pad(end_date.getHours()) +
            ':' +
            this.pad(end_date.getMinutes()) +
            ':' +
            this.pad(end_date.getSeconds()) +
            '.000Z',
          value: total_downtime
        });

        unmonitored_raw_data.push({
          name:
            end_date.getFullYear() +
            '-' +
            end_date.getMonth() +
            '-' +
            end_date.getDate() +
            'T' +
            this.pad(end_date.getHours()) +
            ':' +
            this.pad(end_date.getMinutes()) +
            ':' +
            this.pad(end_date.getSeconds()) +
            '.000Z',
          value: total_unmonitored
        });
      }
    }

    this.uptimes_number_cards_data.push({
      name: 'Ratio (%)',
      value: Number.parseFloat(uptime_ratio.toFixed(2))
    });

    this.uptime_linear_options['value'] = Number.parseFloat(uptime_ratio.toFixed(2));
    if (Number.parseFloat(uptime_ratio.toFixed(2)) < this.application['uptime_requirements'][0]['target_value']) {
      this.uptime_linear_options['scheme'] = {
        domain: ['#ad0000']
      };
    } else {
      this.uptime_linear_options['scheme'] = {
        domain: ['#1e75b5']
      };
    }

    if (this.displayUptimeRequirements) {
      this.uptimes_ratio_chart_data = [
        {
          name: 'Uptime Ratio',
          series: uptimes_data
        },
        {
          name: 'Requirement Target Value',
          series: requirements_target_data
        },
        {
          name: 'Requirement Threshold Value',
          series: requirements_threshold_data
        }
      ];

      this.uptimes_number_cards_data.push({
        name: 'Target Ratio (%)',
        value: Number.parseFloat(this.application['uptime_requirements'][0]['target_value'].toFixed(2))
      });

      this.uptimes_number_cards_data_2.push({
        name: 'Difference (%)',
        value: Number.parseFloat((uptime_ratio - this.application['uptime_requirements'][0]['target_value']).toFixed(2))
      });

      this.uptimes_number_cards_data_2.push({
        name: 'Difference Ratio',
        value: Number.parseFloat(
          (
            (uptime_ratio - this.application['uptime_requirements'][0]['target_value']) /
            this.application['uptime_requirements'][0]['target_value']
          ).toFixed(2)
        )
      });

      this.uptimes_number_cards_options['view'] = [360, 140];

      if (uptime_ratio - this.application['uptime_requirements'][0]['target_value'] < 0) {
        this.uptimeCardsColorScheme = {
          domain: ['#5e9cd6', '#5e9cd6', '#d10000', '#d10000']
        };

        this.uptimeCardsColorScheme_2 = {
          domain: ['#e02323', '#e02323']
        };

        this.uptimes_number_cards_options['textColor_2'] = '#e02323';
      } else {
        this.uptimeCardsColorScheme = {
          domain: ['#5e9cd6', '#5e9cd6', '#289b22', '#289b22']
        };

        this.uptimeCardsColorScheme_2 = {
          domain: ['#289b22', '#289b22']
        };

        this.uptimes_number_cards_options['textColor_2'] = '#289b22';
      }
    } else {
      this.uptimes_ratio_chart_data = [
        {
          name: 'Uptime Ratio',
          series: uptimes_data
        }
      ];

      this.uptimes_number_cards_data.push({
        name: 'Uptime (s)',
        value: total_uptime
      });

      this.uptimes_number_cards_data_2.push({
        name: 'Downtime (s)',
        value: total_downtime
      });

      this.uptimes_number_cards_data_2.push({
        name: 'Unmonitored (s)',
        value: total_unmonitored
      });

      this.uptimes_number_cards_options['view'] = [360, 140];
      this.uptimeCardsColorScheme = {
        domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
      };

      this.uptimeCardsColorScheme_2 = {
        domain: ['#967cba', '#4e9388', '#5e9cd6', '#aa313f', '#b78356', '#929e52']
      };

      this.uptimes_number_cards_options['textColor_2'] = '#efefef';
    }
  }

  displayResponseTimes(): void {
    if (!this.response_data) {
      return;
    }

    let start_date: Date = null;
    let date_fields = this.findLast(this.response_data['response_times']);

    let max_response = -1;
    let total_response = 0;
    let entries = 0;

    let response_times_data = [];

    let requirement_target_data = [];
    let requirement_threshold_data = [];

    this.response_number_cards_data = [];
    this.response_number_cards_data_2 = [];

    for (let j = 0; j < 24; j++) {
      let entry = this.response_data['response_times'][date_fields[0]][date_fields[1]][j];
      if (entry != null && new Date(entry['start_time'] * 1000).getFullYear() == new Date().getFullYear()) {
        if (start_date == null) {
          start_date = new Date(entry['start_time'] * 1000);
          //this.response_times_data_chart_options['yAxisLabel'] = "Response Times On " + start_date.toDateString();
        }

        if (entry['avgresponse'] > max_response) {
          max_response = entry['avgresponse'];
        }
        total_response = total_response + entry['avgresponse'];
        entries++;

        let start = new Date(entry['start_time'] * 1000);
        let end = new Date((entry['start_time'] + 3600) * 1000);

        response_times_data.push({
          name:
            'Average Response Time From ' +
            start.getFullYear() +
            '-' +
            start.getMonth() +
            '-' +
            start.getDate() +
            'T' +
            this.pad(start.getHours()) +
            ':' +
            this.pad(start.getMinutes()) +
            ':' +
            this.pad(start.getSeconds()) +
            '.000Z to ' +
            end.getFullYear() +
            '-' +
            end.getMonth() +
            '-' +
            end.getDate() +
            'T' +
            this.pad(end.getHours()) +
            ':' +
            this.pad(end.getMinutes()) +
            ':' +
            this.pad(end.getSeconds()) +
            '.000Z',
          value: entry['avgresponse']
        });

        if (this.application['response_time_requirements']) {
          requirement_target_data.push({
            name:
              'Average Response Time From ' +
              start.getFullYear() +
              '-' +
              start.getMonth() +
              '-' +
              start.getDate() +
              'T' +
              this.pad(start.getHours()) +
              ':' +
              this.pad(start.getMinutes()) +
              ':' +
              this.pad(start.getSeconds()) +
              '.000Z to ' +
              end.getFullYear() +
              '-' +
              end.getMonth() +
              '-' +
              end.getDate() +
              'T' +
              this.pad(end.getHours()) +
              ':' +
              this.pad(end.getMinutes()) +
              ':' +
              this.pad(end.getSeconds()) +
              '.000Z',
            value: this.application['response_time_requirements'][0]['target_value']
          });

          requirement_threshold_data.push({
            name:
              'Average Response Time From ' +
              start.getFullYear() +
              '-' +
              start.getMonth() +
              '-' +
              start.getDate() +
              'T' +
              this.pad(start.getHours()) +
              ':' +
              this.pad(start.getMinutes()) +
              ':' +
              this.pad(start.getSeconds()) +
              '.000Z to ' +
              end.getFullYear() +
              '-' +
              end.getMonth() +
              '-' +
              end.getDate() +
              'T' +
              this.pad(end.getHours()) +
              ':' +
              this.pad(end.getMinutes()) +
              ':' +
              this.pad(end.getSeconds()) +
              '.000Z',
            value: this.application['response_time_requirements'][0]['target_threshold']
          });
        }
      }
    }

    this.response_number_cards_data.push({
      name: 'Max (ms)',
      value: max_response
    });

    if (this.displayResponseRequirements) {
      this.response_times_data_chart_options['yScaleMax'] =
        Math.max(
          max_response,
          this.application['response_time_requirements'][0]['target_value'],
          this.application['response_time_requirements'][0]['target_threshold']
        ) +
        Math.round(
          Math.max(
            max_response,
            this.application['response_time_requirements'][0]['target_value'],
            this.application['response_time_requirements'][0]['target_threshold']
          ) * 0.25
        );
    } else {
      this.response_times_data_chart_options['yScaleMax'] = max_response + Math.round(max_response * 0.25);
    }

    this.response_linear_options['value'] = max_response;
    if (
      Number.parseFloat(max_response.toFixed(2)) > this.application['response_time_requirements'][0]['target_value']
    ) {
      this.response_linear_options['scheme'] = {
        domain: ['#ad0000']
      };
    } else {
      this.response_linear_options['scheme'] = {
        domain: ['#1e75b5']
      };
    }

    if (this.displayResponseRequirements) {
      this.response_times_chart_data = [
        {
          name: 'Response Times',
          series: response_times_data
        },
        {
          name: 'Requirement Target Value',
          series: requirement_target_data
        },
        {
          name: 'Requirement Threshold Value',
          series: requirement_threshold_data
        }
      ];

      this.response_number_cards_data.push({
        name: 'Target (ms)',
        value: this.application['response_time_requirements'][0]['target_value']
      });

      this.response_number_cards_data_2.push({
        name: 'Difference (ms)',
        value: Number.parseFloat(
          (max_response - this.application['response_time_requirements'][0]['target_value']).toFixed(2)
        )
      });

      this.response_number_cards_data_2.push({
        name: 'Difference Ratio',
        value: Number.parseFloat(
          (
            (max_response - this.application['response_time_requirements'][0]['target_value']) /
            this.application['response_time_requirements'][0]['target_value']
          ).toFixed(2)
        )
      });

      if (max_response > this.application['response_time_requirements'][0]['target_value']) {
        this.responseCardsColorScheme = {
          domain: ['#5e9cd6', '#5e9cd6', '#d10000', '#d10000']
        };
        this.responseCardsColorScheme_2 = {
          domain: ['#e02323', '#e02323']
        };
        this.response_number_cards_options['textColor_2'] = '#e02323';
      } else {
        this.responseCardsColorScheme = {
          domain: ['#5e9cd6', '#5e9cd6', '#289b22', '#289b22']
        };
        this.responseCardsColorScheme_2 = {
          domain: ['#289b22', '#289b22']
        };
        this.response_number_cards_options['textColor_2'] = '#289b22';
      }

      this.response_number_cards_options['view'] = [360, 140];
    } else {
      this.response_times_chart_data = [
        {
          name: 'Response Times',
          series: response_times_data
        }
      ];

      this.response_number_cards_data.push({
        name: 'Average (ms)',
        value: Number.parseFloat((total_response / entries).toFixed(2))
      });

      this.response_number_cards_options['view'] = [360, 140];
      this.responseCardsColorScheme = {
        domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
      };

      this.responseCardsColorScheme_2 = {
        domain: ['#5e9cd6', '#aa313f', '#967cba', '#4e9388', '#b78356', '#929e52']
      };
      this.response_number_cards_options['textColor_2'] = '#efefef';
    }
  }

  /*
  displayUptimes(): void {

    if (!this.uptimes_data) {
      this.uptimes_ratio_gauge_data = null;
      return;
    }

    this.number_cards_data = [];

    let total_uptime = 0;
    let total_downtime = 0;
    let total_unmonitored = 0;
    let uptime_ratio: number;

    let current_date = new Date();
    let current_month = current_date.getMonth();

    if (current_date.getDay() == 1) {
      current_month--;
    }

    let first_date = null;

    //console.log(current_date.getMonth());

    for (let entry of this.uptimes_data['data'][current_month]) {
      if (entry != null && (new Date(entry['start_time'] * 1000)).getFullYear() == new Date().getFullYear()) {
        if (first_date == null) {
          first_date = new Date(entry['start_time'] * 1000);
        }

        total_uptime = total_uptime + entry['uptime'];
        total_downtime = total_downtime + entry['downtime'];
        total_unmonitored = total_unmonitored + entry['unmonitored'];

        uptime_ratio = total_uptime / (total_downtime + total_uptime) * 100.0;
      }
    }

    this.current_uptimes_ratio = uptime_ratio;

    this.uptimes_ratio_gauge_data = [{
      name: "Uptime Ratio",
      value: Number.parseFloat(uptime_ratio.toFixed(2))
    }]

    if (this.application['uptime_requirements'])
    {
      let requirement = this.application['uptime_requirements'][0];

      this.uptimes_ratio_gauge_data.push({
        name: "Requirement " + requirement['id'] + " Target Value",
        value: requirement['target_value']
      })

      this.uptimes_ratio_gauge_data.push({
        name: "Requirement " + requirement['id'] + " Threshold Value",
        value: requirement['target_threshold']
      })
    }

    this.number_cards_data.push({
      name: "Uptime Ratio",
      value: Number.parseFloat(uptime_ratio.toFixed(2))
    })

    this.number_cards_data.push({
      name: "Total Uptime",
      value: total_uptime
    })

    this.number_cards_data.push({
      name: "Total Downtime",
      value: total_downtime
    })

    this.number_cards_data.push({
      name: "Total Unmonitored",
      value: total_unmonitored
    })
  }

  displayResponseTimes(): void {
    if (!this.response_data) {
      this.response_times_gauge_data = null;
      return;
    }

    let current_date = new Date();
    let current_month = current_date.getMonth();

    if (current_date.getDay() == 1) {
      current_month--;
    }

    //console.log(this.response_data['response_times']);

    let last_day_indices = this.findLast(this.response_data['response_times']);
    //console.log(last_day_indices);
    let last_day: object[] = this.response_data['response_times'][last_day_indices[0]][last_day_indices[1]];
    console.log(last_day);

    //let last_day: object[] = this.response_data['response_times'][current_month][current_date.getDay() - 1];

    let total_response = 0;
    let entries = 0;
    let max_response_time = -1;

    this.current_date = (new Date(last_day[0]['end_time'] * 1000)).toDateString();
    console.log(this.current_date);


    for (let entry of last_day) {
      if (entry) {
        if (entry['avgresponse'] > max_response_time) {
          max_response_time = entry['avgresponse'];
        }
        total_response = total_response + entry['avgresponse'];
        entries++;
      }

      this.response_times_gauge_data = [{
        name: "Max Response Time For " + new Date(last_day[0]['end_time'] * 1000).toDateString(),
        value: max_response_time
      }]

      if (this.application['response_time_requirements']) {
        let requirement = this.application['response_time_requirements'][0];

        this.response_times_gauge_data.push({
          name: "Requirement " + requirement['id'] + " Target Value",
          value: requirement['target_value']
        })

        this.response_times_gauge_data.push({
          name: "Requirement " + requirement['id'] + " Threshold Value",
          value: requirement['target_threshold']
        })
      }
    }

    let average_response_time = total_response / entries;

    this.number_cards_data.push({
      name: "Max Response Time",
      value: max_response_time
    });

    this.number_cards_data.push({
      name: "Average Response Time",
      value: average_response_time
    })
  }
*/

  associate(): void {
    for (let client of this.clients) {
      for (let application of this.applications) {
        if (application['client_document_id'] == client['id']) {
          if (!client['applications']) {
            client['applications'] = [];
          }
          client['applications'].push(application);

          this.requestService.getUptimes(application['assigned_id']).subscribe(response => {
            if (response['Successful']) {
              application['uptimes'] = response['Data'];
            }
          });

          this.requestService.getResponseTimes(application['assigned_id']).subscribe(response => {
            if (response['Successful']) {
              application['response_times'] = response['Data'];
            }
          });

          this.requestService.getSLAReqs(application['id']).subscribe(response => {
            if (response['Successful']) {
              application['uptime_requirements'] = [];
              application['response_time_requirements'] = [];
              for (let requirement of response['Data']) {
                if (requirement['sla_type'] == 'uptime') {
                  application['uptime_requirements'].push(requirement);
                } else if (requirement['sla_type'] == 'response_time') {
                  application['response_time_requirements'].push(requirement);
                }
              }
            }
          });

          this.requestService.getStatus(application['id']).subscribe(response => {
            if (response['Successful']) {
              application['status_history_collection'] = response['Data'];
              console.log(application['status_history_collection']);
            }
          });
        }
      }

      if (!client['applications']) {
        client['placeholder'] = 'none';
      } else {
        client['placeholder'] = 'application';
      }
    }
  }

  findLastStatus(input: object[][]): object {
    for (let i = input.length - 1; i >= 0; i--) {
      for (let j = input[i].length - 1; j >= 0; j--) {
        if (input[i][j]) {
          return {
            metric_name: input[i][j]['metric_name'],
            indices: [i, j]
          };
        }
      }
    }
  }

  findLast(input: object[][][]): number[] {
    for (let i = input.length - 1; i >= 0; i--) {
      for (let j = input[i].length - 1; j >= 0; j--) {
        for (let k = 0; k < input[i][j].length; k++) {
          if (!input[i][j][k]) {
            break;
          }
          if (k == input[i][j].length - 1) {
            return [i, j];
          }
        }
      }
    }
  }

  setClient(): void {
    for (let client of this.clients) {
      if (client['id'] == this.client_id) {
        this.client = client;
      }
    }
  }

  uptimes_ratio_formatting(): string {
    return 'Uptime Ratio';
  }

  response_times_formatting(): string {
    return 'Response Time';
  }

  cards_value_formatting(input: any): string {
    if (
      input['label'] == 'Total Uptime' ||
      input['label'] == 'Total Downtime' ||
      input['label'] == 'Total Unmonitored'
    ) {
      return input['data']['value'] + 's';
    } else if (
      input['label'] == 'Ratio' ||
      input['label'] == 'Difference' ||
      input['label'] == 'Difference Ratio' ||
      input['label'] == 'Target Ratio'
    ) {
      return input['data']['value'] + '%';
    } else {
      return input['data']['value'] + 'ms';
    }
  }

  pad(d: number): string {
    return d < 10 ? '0' + d.toString() : d.toString();
  }

  extract(date: string): number[] {
    let index: number = 0;
    let month_string: string = '';
    let day_string: string = '';
    let year_string: string = '';

    for (index; index < date.length; index++) {
      if (date[index] == '/') {
        index++;
        break;
      }
      month_string = month_string + date[index];
    }

    for (index; index < date.length; index++) {
      if (date[index] == '/') {
        index++;
        break;
      }
      day_string = day_string + date[index];
    }

    for (index; index < date.length; index++) {
      year_string = year_string + date[index];
    }

    return [Number.parseInt(month_string), Number.parseInt(day_string), Number.parseInt(year_string)];
  }

  displayStatus(): void {
    let current_date = new Date();
    let current_month = current_date.getMonth();

    if (current_date.getDate() == 1) {
      current_month--;
    }

    this.current_month = monthMap.get(current_month);
    this.current_year = current_date.getFullYear().toString();

    let days_compliant = 0;
    let days_uptime_threshold = 0;
    let days_response_threshold = 0;
    let days_uptime_not_compliant = 0;
    let days_response_not_compliant = 0;

    for (let status_history of this.application['status_history_collection']) {
      let last_indices: object = this.findLastStatus(status_history['data']);
      if (last_indices['metric_name'] == 'uptime') {
        this.uptime_compliance =
          status_history['data'][last_indices['indices'][0]][last_indices['indices'][1]]['requirement_met_status'];
      } else if (last_indices['metric_name'] == 'response_time') {
        this.response_compliance =
          status_history['data'][last_indices['indices'][0]][last_indices['indices'][1]]['requirement_met_status'];
      }

      for (let status_day of status_history['data'][current_month]) {
        if (!status_day) {
          continue;
        }

        if (status_day['requirement_met_status']) {
          if (!status_day['threshold_passed_status']) {
            days_compliant++;
          } else {
            if (status_day['metric_name'] == 'uptime') {
              days_uptime_threshold++;
            } else if (status_day['metric_name'] == 'response_time') {
              days_response_threshold++;
            }
          }
        }

        if (!status_day['requirement_met_status']) {
          if (status_day['metric_name'] == 'uptime') {
            days_uptime_not_compliant++;
          } else if (status_day['metric_name'] == 'response_time') {
            days_response_not_compliant++;
          }
        }
      }
    }

    this.sla_status_chart_data = [];
    this.sla_misses_chart_data = [];
    this.sla_threshold_chart_data = [];

    this.sla_status_chart_data.push({
      name: 'Days Compliant',
      value: days_compliant
    });

    this.sla_status_chart_data.push({
      name: 'Days Compliant (Threshold)',
      value: days_uptime_threshold + days_response_threshold
    });

    this.sla_status_chart_data.push({
      name: 'Days Not Compliant',
      value: days_uptime_not_compliant + days_response_not_compliant
    });

    this.sla_misses_chart_data.push({
      name: 'Uptime',
      value: days_uptime_not_compliant
    });

    this.sla_misses_chart_data.push({
      name: 'Response Time',
      value: days_response_not_compliant
    });

    this.sla_threshold_chart_data.push({
      name: 'Uptime',
      value: days_uptime_threshold
    });

    this.sla_threshold_chart_data.push({
      name: 'Response Time',
      value: days_response_threshold
    });
  }

  toggleUptimes(): void {
    this.displayUptimeRequirements = !this.displayUptimeRequirements;
    this.displayUptimes();
  }

  toggleResponse(): void {
    this.displayResponseRequirements = !this.displayResponseRequirements;
    this.displayResponseTimes();
  }
}
