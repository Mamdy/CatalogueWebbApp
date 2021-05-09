import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../model/User';
import { CatalogueService } from '../services/catalogue.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  @ViewChild('datatable') table: ElementRef;
  dtOptions:any = {};
  dataTableListeProducts$: User[]=[];
  dtTrigger: Subject<any> = new Subject();

  constructor(private userService: UserService) { 
  
  }

  ngOnInit() {
    //initiliasisation de la variable options
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      ordering: true,
      info: true,
      searchable: true
    };
  }

  getAllUser(){

  }

}
