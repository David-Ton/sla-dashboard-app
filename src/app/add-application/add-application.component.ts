import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/core/request.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss']
})
export class AddApplicationComponent implements OnInit {
  client: object;
  applications: object[];
  application_id: string;

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(map => {
      this.requestService.getClients().subscribe(response => {
        if (response['Successful']) {
          for (let client of response['Data']) {
            if (client['id'] == map.get('id')) {
              this.client = client;
              console.log(client);
            }
          }
        }
      });
    });

    this.requestService.getApplications().subscribe(response => {
      if (response['Successful']) {
        console.log(response['Data']);
        this.applications = response['Data'];
      }
    });
  }

  add(): void {
    //let target = <HTMLSelectElement>document.getElementById("application_select");
    console.log(this.application_id);
    for (let application of this.applications) {
      if (application['id'] == this.application_id) {
        let payload = application;
        payload['client_document_id'] = this.client['id'];
        this.requestService.registerApplication(payload).subscribe(response => {
          if (!response['Successful']) {
            alert(response['Message']);
          } else {
            this.router.navigate(['/clients']);
          }
        });
      }
    }
  }
}
