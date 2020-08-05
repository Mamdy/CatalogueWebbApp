import {ProductInOrder} from "./ProductInOrder";


export class Client {
    email: string;
    firstName: string;
    lastName: string;

    username: string;

    phone: string;

    address: string;
    role: string

    constructor(
        email:string,
        firstName: string,
        lastName: string,
        username: string,
        phone: string,
        address: string,
        role: string){
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.phone = phone;
        this.address = address;
        this.role = role;

    }
}
