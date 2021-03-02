import { Client } from './Client';
import { User } from './User';

export class JwtResponse {
    token: string;
    type: string;
   /* account: string;
    name: string;
    role: string;*/
    user: User;
}