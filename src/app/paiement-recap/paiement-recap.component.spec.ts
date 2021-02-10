import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementRecapComponent } from './paiement-recap.component';

describe('PaiementRecapComponent', () => {
  let component: PaiementRecapComponent;
  let fixture: ComponentFixture<PaiementRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementRecapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaiementRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
