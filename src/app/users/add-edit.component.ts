import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { first } from "rxjs/operators";
import { AlertService } from "../_services/alert.service";
import { UserService } from "../_services/user.service";
import { MustMatch } from "../_helpers/must-match.validator";
import { User, BlankUser } from "../_models/user";
@Component({ templateUrl: "add-edit.component.html", selector: "app-add-asdf" })
export class AddEditComponent implements OnInit {
  @Input() user: User
  @Input() submitted = false
  @Output() isValid = new EventEmitter();
  @Output() userFormValue = new EventEmitter();
  userForm: FormGroup;

  //  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  //loading = false;
  //submitted = false;

  constructor(private formBuilder: FormBuilder) {
    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }
    //interface for options provided to AbstractControl
    //formOptions is then passed into the formBuilder.group and checks that password and confirm password are the same
    //https://angular.io/api/forms/FormBuilder
    const formOptions: AbstractControlOptions = {
      validators: MustMatch("password", "confirmPassword")
    };

    this.userForm = this.formBuilder.group(
      {
        title: ["", Validators.required],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        role: ["", Validators.required],
        password: ["", passwordValidators],
        confirmPassword: [
          "",
          this.isAddMode ? Validators.required : Validators.nullValidator
        ]
        //only need the validators on the password if it is in edit mode
      },
      formOptions
    );

  
  }



  ngOnInit() {
    console.log("user form", this.userForm);
    console.log("addMode", this.isAddMode);
    console.log("user before patch", this.user);
    this.isAddMode = !this.user?.id;

    if (!this.isAddMode) { //if editing
      console.log("before pathbalue", this.user);
      this.userForm.patchValue(this.user);
      this.isValid.emit(this.userForm.valid); //because the form is valid at this point; without this you will have to edit the form to activate the submit button

    }
      // here we are subscribing to changes to the form. This will fire anytime there is a change in our form.
    this.userForm.valueChanges.subscribe(() => {
      //valueChanges returns an observable that emits the latest form values
      console.log("emitting", this.userForm.valid);
      this.isValid.emit(this.userForm.valid);
      console.log('before emit', this.userForm.value)
      
      this.userFormValue.emit(this.userForm.value);
    });
    // console.log('id:', this.id, 'type of id:', typeof this.id)
  }
  

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }

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
