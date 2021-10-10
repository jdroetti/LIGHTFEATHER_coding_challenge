import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient
  ) { }

  rootURL: string = '/api'

  getSupervisors(){
    return this.http.get(this.rootURL + '/supervisors');
  }

  postNotification(notification: any){
    return this.http.post(this.rootURL + '/notification', {notification});
  }
}
