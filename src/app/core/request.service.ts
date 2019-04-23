import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginContext } from './authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private get_clients_url: string = 'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/clients';
  private add_client_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/storeclient';
  private get_all_requirements_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/requirements';
  private get_requirements_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/getrequirements';
  private add_requirement_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/storerequirement';
  private get_applications_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/getallapps';
  private register_application_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/application';
  private get_user_url: string = 'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/GetUser';
  private dash_sla_req_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/getrequirementsforspecificapp';
  private dash_uptimes_url: string = 'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/uptimes';
  private remove_clients_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/disableclient';
  private response_times_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/responsetimes';
  private get_uptimes_url: string = 'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/uptimes';
  private get_application_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/getsingleapp';
  private get_application_by_client_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/application';
  private remove_application_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/removeapplication';
  private remove_requirement_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/disablerequirement';
  private get_status_url: string = 'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/getstatus';
  private add_phone_number_url: string =
    'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/receiver';
  private add_email_url = 'https://sladashboardtestapi20190125105646.azurewebsites.net/api/database/email';

  constructor(private http: HttpClient) {}

  public getClients(): Observable<object> {
    return this.http.get(this.get_clients_url);
  }

  public addClient(name: string): Observable<object> {
    return this.http.post(this.add_client_url + '?name=' + name, {});
  }

  public addRequirement(body: object): Observable<object> {
    return this.http.post(this.add_requirement_url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public getAllRequirements(): Observable<object> {
    return this.http.get(this.get_all_requirements_url);
  }

  public getRequirements(client_id: string): Observable<object> {
    return this.http.get(this.get_requirements_url + '?client_id=' + client_id);
  }

  public getApplications(): Observable<object> {
    return this.http.get(this.get_applications_url);
  }

  public registerApplication(body: object): Observable<object> {
    return this.http.post(this.register_application_url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public getDashUptimes(app_id: string): Observable<object> {
    return this.http.get(this.dash_uptimes_url + '?application_objectid=' + app_id);
  }

  public getSLAReqs(appl_id: string): Observable<object> {
    return this.http.get(this.dash_sla_req_url + '?application_id=' + appl_id);
  }

  public getUser(context: LoginContext): Observable<object> {
    let body = {
      username: context.username,
      password: context.password
    };

    console.log(body);

    return this.http.post(this.get_user_url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public removeClient(name: string): Observable<object> {
    return this.http.get(this.remove_clients_url + '?client_name=' + name);
  }

  public getResponseTimes(application_id: string): Observable<object> {
    return this.http.get(this.response_times_url + '?application_id=' + application_id);
  }

  public getUptimes(application_id: string): Observable<object> {
    return this.http.get(this.get_uptimes_url + '?application_id=' + application_id);
  }

  public getApplication(id: string): Observable<object> {
    return this.http.get(this.get_application_url + '?application_id=' + id);
  }

  public getApplicationsByClient(client_id: string): Observable<object> {
    return this.http.get(this.get_application_by_client_url + '?client_id=' + client_id);
  }

  public removeApplication(application_id: string): Observable<object> {
    return this.http.get(this.remove_application_url + '?application_id=' + application_id);
  }

  public removeRequirement(requirement_id: string): Observable<object> {
    return this.http.get(this.remove_requirement_url + '?requirement_id=' + requirement_id);
  }

  public getStatus(application_objectid: string): Observable<object> {
    return this.http.get(this.get_status_url + '?application_objectid=' + application_objectid);
  }

  public add_phone_number(application_id: string, phone_number: string): Observable<object> {
    return this.http.get(this.add_phone_number_url + '?application_id=' + application_id + '&number=' + phone_number);
  }

  public add_email(application_id: string, email: string): Observable<object> {
    return this.http.get(this.add_email_url + '?application_id=' + application_id + '&address=' + email);
  }
}
