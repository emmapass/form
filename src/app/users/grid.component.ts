import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService } from "../_services/alert.service";
import { Tile } from "../_models/tile";
import { UserService } from "../_services/user.service";
import { User } from "../_models/user";
import { first, switchMap } from "rxjs/operators";

/*export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  addEdit: boolean;

}*/

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html"
  //styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  // here we instantiate our form variables for our models.
  user: User; // switching because not using ngmodel to bind Observable<User>;
  private userValid: boolean = false;
  id!: string;
  isAddMode: boolean = false;
  tiles: Tile[] = [];
  text = ["one", "two", "three", "four"];
  cols = [1, 1, 1, 1];
  rows = [1, 1, 1, 1];
  colors = ["lightgreen", "lightblue", "lightpink", "#DDBDF1"];
  submitted = false;

  /*tiles: Tile[] = [
    {text: 'Two', cols: 1, rows: 1, color: 'lightgreen', addEdit: , addEdit2, addEdit3, addEdit4},
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 1, rows: 1, color: '#DDBDF1'},
  ];*/
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    //this.tiles[0] = new Tile()
    for (let i = 0; i < 4; i++) {
      this.tiles.push(new Tile());
    }
    console.log("tiles", this.tiles);
  }

  ngOnInit(): void {
    //set up tiles
    for (let index = 0; index < this.tiles.length; index++) {
      this.tiles[index].text = this.text[index];
      this.tiles[index].cols = this.cols[index];
      this.tiles[index].rows = this.rows[index];
      this.tiles[index].color = this.colors[index];
    }

    this.tiles[0].addEdit = true;
    this.tiles[1].addEdit2 = true;
    this.tiles[2].addEdit3 = true;
    this.tiles[3].addEdit4 = true;
    console.log("tiles 2", JSON.stringify(this.tiles));

    //get data from userService
    this.id = this.route.snapshot.params["id"]; //just a number based off of when the user was added ex. 1 or 2 or 3. Will be undefined when adding a new user.
    this.isAddMode = !this.id;
    if (!this.isAddMode) {
      //this.user = this.userService.getById(this.id);
      this.userService.getById(this.id).subscribe(user => (this.user = user));
      //this.user.subscribe(user => console.log("getById", user));
      console.log("user after getById", this.user);
      // .pipe(first())
      //  .pipe(switchMap(x => this.user = of(x)))
      //   .subscribe(x => console.log('x', x))
      // .subscribe(x => this.user = x)
      //.subscribe(x => this.form.patchValue(x));
      //console.log('form:', this.form)
    }
  }
  isFormValid() {
    if (this.userValid) {
      return true;
    } else {
      return false;
    }
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    console.log("user", this.user);
    //ADD LOADING FROM USERSERVICE ACTUALLY NO NEED this.loading = true;
    this.userService.postUser(this.user, this.id);
    /*  if (this.isAddMode) {
        this.createUser();
    } else {
        this.updateUser();
    }*/
  }
}
