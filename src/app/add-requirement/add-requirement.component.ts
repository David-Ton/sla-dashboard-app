import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactHelpers } from 'babel-types';
import { RequestService } from '@app/core/request.service';

@Component({
  selector: 'app-add-requirement',
  templateUrl: './add-requirement.component.html',
  styleUrls: ['./add-requirement.component.scss']
})
export class AddRequirementComponent implements OnInit {
  application_id: string;
  applications: object[];
  client_id: string;
  sla_type: string;

  constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.client_id = map.get('id');

      this.requestService.getApplicationsByClient(this.client_id).subscribe(response => {
        if (response['Successful']) {
          this.applications = response['Data'];
        }
      });
    });
  }

  submitRequirement(): void {
    let description_input = <HTMLInputElement>document.getElementById('requirement_description_input');
    let target_value_input = <HTMLInputElement>document.getElementById('requirement_target_value_input');
    let threshold_value_input = <HTMLInputElement>document.getElementById('requirement_threshold_value_input');

    if (
      !description_input.value ||
      !target_value_input.value ||
      !threshold_value_input.value ||
      !this.client_id ||
      !this.application_id ||
      !this.sla_type
    ) {
      alert('All fields are required.');
      return;
    }

    let period: number;
    if (this.sla_type == 'response_time') {
      period = 86400;
    } else if (this.sla_type == 'uptime') {
      period = 86400 * 30;
    }

    let payload = {
      client_id: this.client_id,
      application_id: this.application_id,
      description: description_input.value,
      sla_type: this.sla_type,
      target_value: target_value_input.value,
      target_threshold: threshold_value_input.value,
      period: period
    };

    this.requestService.addRequirement(payload).subscribe(response => {
      this.router.navigate(['/clients']);
    });
  }
}
