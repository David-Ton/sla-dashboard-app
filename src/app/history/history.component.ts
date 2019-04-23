import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/core/request.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  months_map: Map<number, string> = new Map([
    [1, 'January'],
    [2, 'February'],
    [3, 'March'],
    [4, 'April'],
    [5, 'May'],
    [6, 'June'],
    [7, 'July'],
    [8, 'August'],
    [9, 'September'],
    [10, 'October'],
    [11, 'November'],
    [12, 'December']
  ]);

  uptimes_chart_options: object = {
    view: [700, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Timeslice End',
    showYAxisLabel: true,
    yAxisLabel: '',
    timeline: true,
    autoScale: false,
    yScaleMin: 0,
    yScaleMax: 100
  };

  uptimes_data_chart_options: object = {
    view: [700, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Timeslice End',
    showYAxisLabel: true,
    yAxisLabel: '',
    timeline: true,
    autoScale: false
  };

  response_times_data_chart_options: object = {
    view: [700, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Test Time',
    showYAxisLabel: true,
    yAxisLabel: '',
    timeline: true,
    autoScale: false
  };

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  client: object;
  clients: object[];
  applications: object[];

  client_id: string;
  application_id: string;
  selected_application: object;

  data: object;
  response_data: object;
  uptimes_ratio_chart_data: object[];
  times_chart_data: object[];
  response_times_chart_data: object[];

  uptime_requirement_id: string;
  response_time_requirement_id: string;

  uptime_requirement: object;
  response_time_requirement: object;

  start: string;
  end_date: string;
  date: string;
  choice: string;

  constructor(private requestService: RequestService, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('History');

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

  filter(): void {
    let total_uptime = 0;
    let total_downtime = 0;
    let total_unmonitored = 0;
    let start_date = null;

    if (this.choice == 'ratio' || this.choice == 'times') {
      this.end_date = (<HTMLInputElement>document.getElementById('end_date_input')).value;
      this.start = (<HTMLInputElement>document.getElementById('start_date_input')).value;

      if (!(this.end_date && this.start)) {
        return;
      }

      let date_fields = this.extract(this.end_date);
      let start_date_fields = this.extract(this.start);

      let uptimes_data = [];
      let uptimes_raw_data = [];
      let downtimes_raw_data = [];
      let unmonitored_raw_data = [];

      let requirements_target_data = [];
      let requirements_threshold_data = [];

      for (let i = start_date_fields[1] - 1; i < date_fields[1]; i++) {
        let entry = this.data['data'][date_fields[0] - 1][i];
        if (entry != null && new Date(entry['start_time'] * 1000).getFullYear() == new Date().getFullYear()) {
          if (start_date == null) {
            start_date = new Date(entry['start_time'] * 1000);
            this.uptimes_chart_options['yAxisLabel'] = 'Uptime Ratio Since ' + start_date.toDateString() + ' [%]';
            this.uptimes_data_chart_options['yAxisLabel'] = 'Times Data Since ' + start_date.toDateString() + ' [s]';
          }
          let end_date = new Date(entry['end_time'] * 1000);

          total_uptime = total_uptime + entry['uptime'];
          total_downtime = total_downtime + entry['downtime'];
          total_unmonitored = total_unmonitored + entry['unmonitored'];

          let uptime_ratio = (total_uptime / (total_downtime + total_uptime)) * 100.0;

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
            value: uptime_ratio
          });

          if (this.uptime_requirement) {
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
              value: this.uptime_requirement['target_value']
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
              value: this.uptime_requirement['target_threshold']
            });
          }

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

      if (requirements_threshold_data[0] && requirements_target_data[0]) {
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
      } else {
        this.uptimes_ratio_chart_data = [
          {
            name: 'Uptime Ratio',
            series: uptimes_data
          }
        ];
      }

      this.times_chart_data = [
        {
          name: 'Uptime',
          series: uptimes_raw_data
        },
        {
          name: 'Downtime',
          series: downtimes_raw_data
        },
        {
          name: 'Unmonitored',
          series: unmonitored_raw_data
        }
      ];

      console.log(this.uptimes_ratio_chart_data);
    }

    if (this.choice == 'response') {
      this.date = (<HTMLInputElement>document.getElementById('date_input')).value;
      let date_fields = this.extract(this.date);

      let response_times_data = [];

      let requirement_target_data = [];
      let requirement_threshold_data = [];

      for (let j = 0; j < 24; j++) {
        let entry = this.response_data['response_times'][date_fields[0] - 1][date_fields[1] - 1][j];
        if (entry != null && new Date(entry['start_time'] * 1000).getFullYear() == new Date().getFullYear()) {
          if (start_date == null) {
            start_date = new Date(entry['start_time'] * 1000);
            this.response_times_data_chart_options['yAxisLabel'] = 'Response Times On ' + start_date.toDateString();
          }
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

          if (this.response_time_requirement) {
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
              value: this.response_time_requirement['target_value']
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
              value: this.response_time_requirement['target_threshold']
            });
          }
        }
      }

      if (this.response_time_requirement) {
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
      } else {
        this.response_times_chart_data = [
          {
            name: 'Response Times',
            series: response_times_data
          }
        ];
      }

      console.log(this.response_times_chart_data);
    }
  }

  displayData(): void {
    for (let application of this.applications) {
      if (this.application_id == application['id']) {
        //console.log(application['uptimes']);
        this.selected_application = application;
        this.data = application['uptimes'];
        console.log(application['response_times']);
        this.response_data = application['response_times'];
        break;
      }
    }
  }

  setRequirements(): void {
    for (let requirement of this.selected_application['uptime_requirements']) {
      if (this.uptime_requirement_id == requirement['id']) {
        this.uptime_requirement = requirement;
      }
    }

    for (let requirement of this.selected_application['response_time_requirements']) {
      if (this.response_time_requirement_id == requirement['id']) {
        this.response_time_requirement = requirement;
      }
    }

    this.filter();
  }

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
        }
      }

      if (!client['applications']) {
        client['placeholder'] = 'none';
      } else {
        client['placeholder'] = 'application';
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

  setChoice(choice: string): void {
    this.choice = choice;
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
}
