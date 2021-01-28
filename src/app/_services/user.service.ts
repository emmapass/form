import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models/user'
import { Role } from '../_models/role';
import { first } from 'rxjs/operators';
import {  AlertService } from './alert.service'; 
import { Router, ActivatedRoute } from '@angular/router';

// array in local storage for registered users
const usersKey = 'angular-11-crud-example-users';
const usersJSON = localStorage.getItem(usersKey); //will return null if no users have been made
let users: any[] = usersJSON ? JSON.parse(usersJSON) : [{ //if null (i.e. no users the user will be Mr. Joe) otherwise the users will be the ones associated withu the key userKey
    id: '1',
    title: 'Mr',
    firstName: 'Joe',
    lastName: 'Bloggs',
    email: 'joe@bloggs.com',
    role: Role.User,
    password: 'joe123'
}];

@Injectable({
  providedIn: 'root'
})
export class UserService { //returns a map of users
  loading = false;
  usersNew!: User[];
  getAll() {
    return of(users.map(x => this.basicDetails(x))); //of creates an observable
  }
  getById(id) {
    console.log('users', JSON.stringify(users))
    console.log('id of user type', typeof users[0].id, 'id of param type', typeof id)
    const user = users.find(x => x.id === id);
    console.log('USER:', user)
    return of(this.basicDetails(user));
  }
  postUser(user: Observable<User>/*id, updatedFormValue*/) {
    user.subscribe(user => {
      if (user.id) {//id not undefined
        this.updateUser(user.id, user)
          .pipe(first())
          .subscribe(() => {
            this.alertService.success('User updated', { keepAfterRouteChange: true });
            this.router.navigate(['../../'], { relativeTo: this.route });
        })
        .add(() => this.loading = false);
      } else {
        this.createUser(user)
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
    })
    
  }
  updateUser(id, updatedFormValue) {
    let user = users.find(x => x.id === id);
    //if updated email is different than the one stored AND this updated email is associated with a user
    if (updatedFormValue.email !== user.email && users.find(x => x.email === updatedFormValue.email)) {
        return this.error(`User with the email ${updatedFormValue.email} already exists`);
    }

    // only update password if entered
    if (!updatedFormValue.password) {
        delete updatedFormValue.password; //prevents adding an undefined password
    }

    // update and save user
    Object.assign(user, updatedFormValue);
    localStorage.setItem(usersKey, JSON.stringify(users));

    return of(1); //just to immitate waiting for the request to be completed
  }
  createUser(updatedFormValue) {
    const user = updatedFormValue;
    console.log('hello?')
    if (users.find(x => x.email === user.email)) {
        return this.error(`User with the email ${user.email} already exists`);
    }

    // assign user id and a few other properties then save
    user.id = this.newUserId().toString();
    console.log('hello2')
    console.log('user', user)
    delete user.confirmPassword;
    users.push(user); //add user to users array
    localStorage.setItem(usersKey, JSON.stringify(users));

    return of(1);
  }
  deleteUser(id) {
    users = users.filter(x => x.id !== id); //users is now all users that don't have that id
    localStorage.setItem(usersKey, JSON.stringify(users));
    return of(1);
  }
  basicDetails(user: any) {
      const { id, title, firstName, lastName, email, role } = user;
      let newuser = new User()
      //not sure how to do this more efficiently
      newuser.id = id
      newuser.title = title
      newuser.firstName = firstName
      newuser.lastName = lastName
      newuser.email = email
      newuser.role = role
      //let emma = Object.assign(newuser, { id, title, firstName, lastName, email, role })
      return newuser;
  }
  error(message: any) {
    console.log('EMAIL ALREADY EXISTS')
    return throwError({ error: { message } })
        .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
  }
  newUserId() {
      return users.length ? Math.max(...users.map(x => x.id)) + 1 : 1; //if no users return 1 otherwise return one more than the largest id
  }
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
    ) { }
}
