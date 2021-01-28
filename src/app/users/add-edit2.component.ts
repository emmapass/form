import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {  AlertService } from '../_services/alert.service'; 
import { UserService } from '../_services/user.service';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({ templateUrl: 'add-edit2.component.html',   selector: 'idk2',})
export class AddEdit2Component implements OnInit {
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

    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id']; //just a number based off of when the user was added ex. 1 or 2 or 3. Will be undefined when adding a new user. 
        console.log('id:', this.id, 'type of id:', typeof this.id)
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }
        //interface for options provided to AbstractControl
        //formOptions is then passed into the formBuilder.group and checks that password and confirm password are the same
        //https://angular.io/api/forms/FormBuilder 
        const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
       
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', passwordValidators],
            confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
            //only need the validators on the password if it is in edit mode
        }, formOptions);

        if (!this.isAddMode) {
            this.userService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
            console.log('form:', this.form)
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid; the validators sent invalid = true if condition not passed
        if (this.form.invalid) {
            return; //stop the submit process
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

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
    }
}