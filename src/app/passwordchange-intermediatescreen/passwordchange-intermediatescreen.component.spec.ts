import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordchangeIntermediatescreenComponent } from './passwordchange-intermediatescreen.component';

describe('PasswordchangeIntermediatescreenComponent', () => {
  let component: PasswordchangeIntermediatescreenComponent;
  let fixture: ComponentFixture<PasswordchangeIntermediatescreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordchangeIntermediatescreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordchangeIntermediatescreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
