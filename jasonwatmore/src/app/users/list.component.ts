import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users!: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAll()
    .pipe(first())
    .subscribe(users => this.users = users); //set user property
  }
  deleteUser(id: string) {
    const user = this.users.find(x => x.id === id);
    if (!user) return;
    user.isDeleting = true;
    this.userService.deleteUser(id)
       //.pipe(first())
       .subscribe(() => {
         console.log('emma')
         this.users = this.users.filter(x => x.id !== id)
         
       }); //need to update this list of users that is displayed
}
}
