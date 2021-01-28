import { Role } from './role';

export class User {
    id!: string;
    title!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    role!: Role;
    isDeleting: boolean = false;
}

export class BlankUser {
    id: string = undefined;
    title: string = '';
    firstName: string = '';
    lastName: string= '';
    email: string = '';
    role: Role = Role.User;
    isDeleting: boolean = false;
}