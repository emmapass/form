import { Injectable } from "@angular/core";
import { Observable, of, Subject, throwError } from "rxjs";
import { delay, materialize, dematerialize } from "rxjs/operators";
import { User } from "../_models/user";
import { Role } from "../_models/role";
import { first } from "rxjs/operators";
import { AlertService } from "./alert.service";
import { Router, ActivatedRoute } from "@angular/router";

// array in local storage for registered users
const usersKey = "angular-11-crud-example-users";
let bigForm = JSON.parse(localStorage.getItem(usersKey))
console.log('initialize', bigForm)
//bigForm = JSON.parse(bigForm)
let users = bigForm?.users ? bigForm?.users : [
      {
        //if null (i.e. no users the user will be Mr. Joe) otherwise the users will be the ones associated withu the key userKey
        id: "1",
        title: "Mr",
        firstName: "Joe",
        lastName: "Bloggs",
        email: "joe@bloggs.com",
        role: Role.User,
        password: "joe123"
      }
    ];
/*const usersJSON = localStorage.getItem(usersKey); //will return null if no users have been made
let users: any[] = usersJSON
  ? JSON.parse(usersJSON)
  : [
      {
        //if null (i.e. no users the user will be Mr. Joe) otherwise the users will be the ones associated withu the key userKey
        id: "1",
        title: "Mr",
        firstName: "Joe",
        lastName: "Bloggs",
        email: "joe@bloggs.com",
        role: Role.User,
        password: "joe123"
      }
    ];*/

@Injectable({
  providedIn: "root"
})
export class UserService {
  //returns a map of users
  loading = false;
  usersNew!: User[];
  getAll() {

    console.log(users.map(x => this.basicDetails(x)))
    return of(users.map(x => this.basicDetails(x))); //of creates an observable
  }
  getById(id) {
    console.log("users", JSON.stringify(users));
    console.log(
      "id of user type",
      typeof users[0].id,
      "id of param type",
      typeof id
    );
    const user = users.find(x => x.id === id);
    console.log("USER:", user);
    return of(this.basicDetails(user));
  }
  postUser(user, id /*: Observable<User>/*id, updatedFormValue*/) {
    //cannot use user.id because the user from formValue does not include id property
    // user.subscribe(user => {
    console.log("user id in post user", user.id);
    if (id) {
      //id not undefined
      this.updateUser(id, user)
        .pipe(first())
        .subscribe(() => {
          this.alertService.success("User updated", {
            keepAfterRouteChange: true
          });
          this.router.navigate(["../../"], { relativeTo: this.route });
        })
        .add(() => (this.loading = false));
    } else {
      this.createUser(user)
        .pipe(first())
        .subscribe(() => {
          this.alertService.success("User added", {
            keepAfterRouteChange: true
          });
          this.router.navigate(["../"], { relativeTo: this.route });
          //../ vs. ../../ because
          //{ path: 'add', component: AddEditComponent },
          //{ path: 'edit/:id', component: AddEditComponent }
        })
        .add(() => (this.loading = false));
    }
    //})
  }
  updateUser(id, updatedFormValue) {
    let user = users.find(x => x.id === id);
    console.log("updated form value email", updatedFormValue.email);
    console.log("user email", user.email);
    //if updated email is different than the one stored AND this updated email is associated with a user
    if (
      updatedFormValue.email !== user.email &&
      users.find(x => x.email === updatedFormValue.email)
    ) {
      return this.error(
        `User with the email ${updatedFormValue.email} already exists`
      );
    }

    // only update password if entered
    if (!updatedFormValue.password) {
      delete updatedFormValue.password; //prevents adding an undefined password
    }

    // update and save user
    Object.assign(user, updatedFormValue);
   // bigForm.users = users
   // bigForm.mat = 'matstring'
    bigForm = {users: users}
    console.log('updated JSON', JSON.stringify(bigForm))
    localStorage.setItem(usersKey, JSON.stringify(bigForm))
    //localStorage.setItem(usersKey, JSON.stringify(users));

    return of(1); //just to immitate waiting for the request to be completed
  }
  createUser(updatedFormValue) {
    const user = updatedFormValue;
    console.log("hello?");
    if (users.find(x => x.email === user.email)) {
      return this.error(`User with the email ${user.email} already exists`);
    }

    // assign user id and a few other properties then save
    user.id = this.newUserId().toString();
    console.log("hello2");
    console.log("user", user);
    delete user.confirmPassword;
    users.push(user); //add user to users array
   // bigForm.users = users
    bigForm = {users: users}
    localStorage.setItem(usersKey, JSON.stringify(bigForm));
    console.log('bigForm', JSON.stringify(bigForm))
    //localStorage.setItem(usersKey, JSON.stringify(users));

    return of(1);
  }
  deleteUser(id) {
    users = users.filter(x => x.id !== id); //users is now all users that don't have that id
    localStorage.setItem(usersKey, JSON.stringify(users));
    return of(1);
  }
  basicDetails(user: any) {
    console.log('user in basic details', user)
    let filtered = Object.fromEntries(Object.entries(user).filter(e => ['id', 'title', 'firstName', 'lastName', 'email', 'role'].includes(e[0])))
    //const { id, title, firstName, lastName, email, role } = user;
    let newuser = new User();
    Object.assign(newuser, filtered)

    console.log('newuser',newuser)
    //let emma = Object.assign(newuser, { id, title, firstName, lastName, email, role })
    return newuser;
  }
  error(message: any) {
    console.log("EMAIL ALREADY EXISTS");
    this.alertService.error("User email already exists", {
      keepAfterRouteChange: false,
      autoClose: false
    });

    return throwError({ error: { message } }).pipe(
      materialize(),
      delay(500),
      dematerialize()
    ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
  }
  newUserId() {
    return users.length ? Math.max(...users.map(x => x.id)) + 1 : 1; //if no users return 1 otherwise return one more than the largest id
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {}
}
