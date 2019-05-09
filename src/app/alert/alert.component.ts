import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertService} from '../alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor( private alerteService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alerteService.getMessage().subscribe(message=>{
      this.message = message;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
