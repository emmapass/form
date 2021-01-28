import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {  AlertService } from '../_services/alert.service'; 
import { UserService } from '../_services/user.service';
import { MustMatch } from '../_helpers/must-match.validator';
import { User, BlankUser } from '../_models/user'
@Component({ templateUrl: 'add-edit.component.html',   selector: 'app-add-asdf',})
export class AddEditComponent implements OnChanges {
    @Input() user: User;
    @Output() isValid = new EventEmitter();
    userForm: FormGroup
   
    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService

    ) {
        this.isAddMode = !this.user.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        //interface for options provided to AbstractControl
        //formOptions is then passed into the formBuilder.group and checks that password and confirm password are the same
        //https://angular.io/api/forms/FormBuilder 
        const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
       
        this.userForm = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', passwordValidators],
            confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
            //only need the validators on the password if it is in edit mode
        }, formOptions);
         // here we are subscribing to changes to the form. This will fire anytime there is a change in our form.
        this.userForm.valueChanges.subscribe(() => { //valueChanges returns an observable that emits the latest form values
            this.isValid.emit(this.userForm.valid)
        });
    }

    ngOnChanges () {
/* 
     * ngModel will throw when trying to access properties of our
     * model when the model itself is undefined. This will happen
     * often as our application handles async data.
     */

    if ( !this.user ) {
        this.user = new BlankUser()
      }
    }

    ngOnInit() {
       // console.log('id:', this.id, 'type of id:', typeof this.id)
  

        
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

   
/*
    private createUser() {
        console.log('id: create', this.id)
        this.userService.createUser(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('User added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route }); 
                //../ vs. ../../ because 
                //{ path: 'add', component: AddEditComponent },
                //{ path: 'edit/:id', component: AddEditComponent }
            })
            .add(() => this.loading = false);
    } 

    private updateUser() {
        this.userService.updateUser(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('User updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }*/
}