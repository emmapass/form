import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { HomeComponent } from './home';

const usersModule = () => import('./users/users.module').then(x => x.UsersModule); //I don't understand how this works (It is a promise and returns usersModule but what is x.UsersModule doing)

const routes: Routes = [
    { path: '', loadChildren: usersModule },
    { path: 'users', loadChildren: usersModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }