import {ProductInOrder} from "./ProductInOrder";


export class Client {
    email: String;

    name: String;

    username: String;

    phone: String;

    address: String;

    role: string;


    constructor(email:String, name: String, username: String){
        this.email = email;
        this.name = name;
        this.username = username

    }
}
