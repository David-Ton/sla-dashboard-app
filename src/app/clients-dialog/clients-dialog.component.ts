import { Component, OnInit } from '@angular/core';
import { RequestService } from '@app/core/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-dialog',
  templateUrl: './clients-dialog.component.html',
  styleUrls: ['./clients-dialog.component.scss']
})
export class ClientsDialogComponent implements OnInit {
  constructor(private httpService: RequestService, private router: Router) {}

  ngOnInit() {}

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
        this.router.navigate(['/clients']);
      }
    });
  }
}
