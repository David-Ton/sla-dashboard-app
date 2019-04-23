import { Component, OnInit } from '@angular/core';
import { RequestService } from '../core/request.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { ClientsDialogComponent } from '@app/clients-dialog/clients-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  clients: object[];
  requirements: object[];

  applications: object[] = [];
  add_requirement_client: string;
  add_application_client: object;

  constructor(private httpService: RequestService, private route: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Clients');

    this.httpService.getClients().subscribe(response => {
      //console.log(response);

      if (response['Successful']) {
        this.clients = response['Data'];

        /*
        for (let client of response["Data"]) {
          this.httpService.getRequirements(client["id"]).subscribe((req_response) => {
            if (req_response["Successful"]) {
              client["requirements"] = req_response["Data"];
            }
          })
        }
        */
      }

      this.httpService.getAllRequirements().subscribe(response => {
        if (response['Successful']) {
          this.requirements = response['Data'];
          if (this.requirements && this.applications) {
            this.associate();
          }
        }
      });

      this.httpService.getApplications().subscribe(response => {
        //console.log(response);
        if (response['Successful']) {
          console.log(response['Data']);
          this.applications = response['Data'];

          for (let client of this.clients) {
            let client_applications = [];
            console.log('Client ID: ' + client['id']);
            for (let application of this.applications) {
              console.log('Application ID: ' + application['client_document_id']);
              if (application['client_document_id'] == client['id']) {
                client_applications.push(application);
              }
            }
            client['applications'] = client_applications;
          }

          if (this.requirements && this.applications) {
            this.associate();
          }
        }
      });
    });
  }

  associate(): void {
    for (let application of this.applications) {
      for (let requirement of this.requirements) {
        if (requirement['application_id'] == application['id']) {
          if (!application['requirements']) {
            application['requirements'] = [];
          }
          application['requirements'].push(requirement);
        }
      }
    }
  }

  openClientsDialog(): void {
    this.route.navigate(['/addclient']);
  }

  removeClient(client_name: string): void {
    this.httpService.removeClient(client_name).subscribe(response => {
      if (!response['Successful']) {
        alert(response['Message']);
      } else {
        window.location.reload();
      }
    });
  }

  navigate(): void {
    console.log('Select');
  }

  addApplication(client: object): void {
    this.route.navigate(['/addapplication/' + client['id']]);
  }

  addRequirement(id: string): void {
    this.route.navigate(['/addrequirement/' + id]);
  }

  removeApplication(application_id: string): void {
    this.httpService.removeApplication(application_id).subscribe(response => {
      if (!response['Successful']) {
        alert(response['Message']);
      } else {
        window.location.reload();
      }
    });
  }

  subscribeText(application_id: string, i: number): void {
    let number = <HTMLSelectElement>document.getElementById(application_id + '_phone_number_' + i.toString());

    this.httpService.add_phone_number(application_id, number.value).subscribe(response => {
      alert(number.value + ' has been subscribed.');
      //this.route.navigate(['/dashboard'])
    });
  }

  subscribeEmail(application_id: string, i: number): void {
    let email = <HTMLSelectElement>document.getElementById(application_id + '_email_' + i.toString());

    this.httpService.add_email(application_id, email.value).subscribe(response => {
      alert(email.value + ' has been subscribed.');
      //this.route.navigate(['/dashboard'])
    });
  }

  submitApplication(): void {
    let payload: object;
    let application_select = <HTMLSelectElement>document.getElementById('application_select');
    //console.log(application_select.value);
    for (let application of this.applications) {
      //console.log(application['id']);
      if (application['id'] == application_select.value) {
        payload = application;
        payload['client_document_id'] = this.add_application_client['id'];
        break;
      }
    }

    console.log(payload);

    this.httpService.registerApplication(payload).subscribe(response => {
      console.log(response);
    });
  }

  removeRequirement(requirement_id: string): void {
    this.httpService.removeRequirement(requirement_id).subscribe(response => {
      if (!response['Successful']) {
        alert(response['Message']);
      } else {
        window.location.reload();
      }
    });
  }

  submitRequirement(): void {
    let application_id_input = <HTMLInputElement>document.getElementById('requirement_application_id_input');
    let description_input = <HTMLInputElement>document.getElementById('requirement_description_input');
    let sla_type_input = <HTMLSelectElement>document.getElementById('requirement_sla_type_input');
    let target_value_input = <HTMLInputElement>document.getElementById('requirement_target_value_input');
    let threshold_value_input = <HTMLInputElement>document.getElementById('requirement_threshold_value_input');
    let period_input = <HTMLInputElement>document.getElementById('requirement_period_input');

    let payload = {
      client_id: this.add_requirement_client,
      application_id: application_id_input.value,
      description: description_input.value,
      sla_type: sla_type_input.value,
      target_value: target_value_input.value,
      target_threshold: threshold_value_input.value,
      period: Number.parseInt(period_input.value)
    };

    this.httpService.addRequirement(payload).subscribe(response => {
      console.log(response);
    });
  }

  addClient(): void {
    let name_input = <HTMLInputElement>document.getElementById('client_name');

    //Validate in sequence
    if (name_input.value.length == 0) {
      alert('Client name should not be empty.');
      return;
    }

    this.httpService.addClient(name_input.value).subscribe(response => {
      if (!response['Successful']) {
        if (response['Code'] == 0) {
          console.log('A client with the chosen name already exists.');
          alert('A client with the chosen name already exists.');
        } else if (response['Code'] == 1) {
          console.log(response['Message']);
          alert(response['Message']);
        }
      } else {
        console.log('Client added successfully.');
      }
    });
  }
}
