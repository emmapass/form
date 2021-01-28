//the alerts component is responsible for displaying alerts like user added or user deleted or user edited 
//it DOES NOT validate that the correct entries/form fields/controls have been filled
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '../_models/alert';
import { AlertService } from '../_services/alert.service';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    @Input() id = 'default-alert';
    @Input() fade = true;

    alerts: Alert[] = [];
    alertSubscription!: Subscription; //represents the execution of an observable; can unsubscribe
    routeSubscription!: Subscription;

    constructor(private router: Router, private alertService: AlertService) { }

    ngOnInit() {
        // subscribe to new alert notifications
        //by calling the alertService.onAlert() method, new alerts are added to the alerts array for display
        this.alertSubscription = this.alertService.onAlert(this.id) //this.id is default alert
            .subscribe(alert => {
                // clear alerts when an empty alert is received
                if (!alert.message) {
                    // filter out alerts without 'keepAfterRouteChange' flag
                    this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                    // reset 'keepAfterRouteChange' flag on the rest
                    this.alerts.forEach(x => x.keepAfterRouteChange = false);
                    console.log('alerts', this.alerts)

                    return;
                }

                // add alert to array
                this.alerts.push(alert);

                // auto close alert if required
                if (alert.autoClose) { //if has tag autoclose (i.e. don't close on click then remove alert after 3 seconds)
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
           });

        // clear alerts on location change
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) { //if event type is instance of navigationstart then clear all alerts with id default-alert
                this.alertService.clear(this.id);
            }
        });
    }

    ngOnDestroy() {
        // unsubscribe to avoid memory leaks
        this.alertSubscription.unsubscribe(); //no longer continues to subscribe alerts
        this.routeSubscription.unsubscribe();
    }

    removeAlert(alert: Alert) {
        // check if already removed to prevent error on auto close
        if (!this.alerts.includes(alert)) return;

        if (this.fade) { //if fade in enabled in the app (set it at the top)
            // fade out alert
            alert.fade = true; //set the fade flag on the alert to true; if it is true then fade will be added to HTML class for the alert

            // remove alert after faded out (assumes fade out takes 250 ms)
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert); //executes after 250 ms
            }, 250);
        } else {
            // remove alert
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }
    /**
     * The cssClass() method returns a corresponding bootstrap alert class for each of the alert types, 
    if you're using something other than bootstrap you can change the CSS classes returned 
    to suit your application.
     * used in alert.component.html to display the fill in the correct class
    */

    cssClass(alert: Alert) {
        if (alert?.type === undefined) return;

        const classes = ['alert', 'alert-dismissable', 'mt-4', 'container'];
                
        const alertTypeClass = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}