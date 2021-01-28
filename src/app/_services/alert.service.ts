/*The alert service acts as the bridge between any component in an Angular CRUD example 
and the alert component that renders alert messages in the UI. 
It contains methods for sending, clearing and subscribing to alert messages.*/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from '../_models/alert';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
      //asObservable creates a new observable with 'subject' as its source
      console.log('on alert') //THIS NEVER LOGS
      return this.subject.asObservable().pipe(filter(x => x && x.id === id)); //x=>x gets rid of null/undefined ALSO have to have id default alert?
  }

  // convenience methods
  success(message: string, options?: Partial<Alert>) {
      this.alert(message, AlertType.Success, options);
  }

  error(message: string, options?: Partial<Alert>) {
      this.alert(message, AlertType.Error, options);
  }
  //not used anywhere
  info(message: string, options?: Partial<Alert>) {
      this.alert(message, AlertType.Info, options);
  }
  //not used anywhere
  warn(message: string, options?: Partial<Alert>) {
      this.alert(message, AlertType.Warning, options);
  }

  // main alert method    
  alert(message: string, type: AlertType, options: Partial<Alert> = {}) {
      const id = options.id || this.defaultId;
      const alert = new Alert(id, type, message, options.autoClose, options.keepAfterRouteChange);
      console.log('alert alert:', alert)

      this.subject.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
      console.log('new Alert(id):', new Alert(id))
      this.subject.next(new Alert(id)); //feeds a new alert into subject that won't display anything 
      /*
      new Alert(id): 
      autoClose: true
      fade: false
      id: "default-alert"
      keepAfterRouteChange: false
      message: undefined
      type: undefined 
      */
  }
  constructor() { }
}
