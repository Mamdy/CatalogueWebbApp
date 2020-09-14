import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-criteria-search-view',
  templateUrl: './criteria-search-view.component.html',
  styleUrls: ['./criteria-search-view.component.css']
})
export class CriteriaSearchViewComponent implements OnInit {
  @Input()page:any;

  constructor() { }

  ngOnInit() {
  }

}
