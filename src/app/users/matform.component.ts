
import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  EventEmitter
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Mat, BlankMat } from "../_models/mat";
import { ChipsAutocompleteExample } from "./chip-list/chip-list.component"
@Component({
  selector: "app-matform",
  templateUrl: "./matform.component.html"
})
export class MatformComponent implements OnInit {
  @Input() mat: Mat;
  @Input() submitted = false
  @Output() isValid = new EventEmitter();
  @Output() matFormValue = new EventEmitter();
  id!: string;
  isAddMode!: boolean;
  toppings = new FormControl(); //replace with enum like role?
  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato"
  ];
  matForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    const formOptions: AbstractControlOptions = {}
    this.matForm = this.formBuilder.group({
      topping: '',
      input: '',
      select: '',
      textarea: ''
    }, formOptions)
  }

  ngOnInit(): void {
    this.isAddMode = !this.mat?.id;
     if (!this.isAddMode) { //if editing
      //console.log("before pathbalue", this.user);
      this.matForm.patchValue(this.mat);
     //DONT NEED YET BC WE HAVE NO VALIDATORS this.isValid.emit(this.matForm.valid); //because the form is valid at this point; without this you will have to edit the form to activate the submit button
     console.log('matForm before emit', this.matForm.value)
      this.matFormValue.emit(this.matForm.value);
    }
    this.matForm.valueChanges.subscribe(() => {
      //valueChanges returns an observable that emits the latest form values
      console.log("emitting matForm", this.matForm.value);
      
      this.matFormValue.emit(this.matForm.value);
    });

  }
  // convenience getter for easy access to form fields
   get f() {
    return this.matForm.controls;
  }

}
