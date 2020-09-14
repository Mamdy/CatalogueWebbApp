import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaSearchViewComponent } from './criteria-search-view.component';

describe('CriteriaSearchViewComponent', () => {
  let component: CriteriaSearchViewComponent;
  let fixture: ComponentFixture<CriteriaSearchViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriteriaSearchViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaSearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
