import { Client } from './Client';

export class JwtResponse {
    token: string;
    type: string;
   /* account: string;
    name: string;
    role: string;*/
    user: Client;
}