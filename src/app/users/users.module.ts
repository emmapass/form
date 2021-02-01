import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; //Exports all the basic Angular directives and pipes, such as NgIf, NgForOf, DecimalPipe, and so on
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'
import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { GridComponent } from './grid.component';
import { AddEdit2Component } from './add-edit2.component';
import { MatformComponent } from './matform.component'
import {MatChipsModule} from '@angular/material/chips';
import { ChipsAutocompleteExample } from './chip-list/chip-list.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        MatGridListModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatChipsModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent,
        GridComponent,
        AddEdit2Component,
        MatformComponent,
        ChipsAutocompleteExample
    ]
})
export class UsersModule { }