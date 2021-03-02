import {ProductInOrder} from "./ProductInOrder";


export class Client {
    civilite: string
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    codePostal: string;
    ville: string;
    pays: string;
    role: string

    constructor(
        civilite:string,
        email:string,
        firstName: string,
        lastName: string,
        phone: string,
        address: string,
        codePostal: string,
        ville: string,
        pays: string,
        role: string){
        this.civilite = civilite,
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.codePostal = codePostal;
        this.ville = ville;
        this.pays = pays;
        this.role = role;

    }
}
