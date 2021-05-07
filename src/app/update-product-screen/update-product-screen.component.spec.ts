import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductScreenComponent } from './update-product-screen.component';

describe('UpdateProductScreenComponent', () => {
  let component: UpdateProductScreenComponent;
  let fixture: ComponentFixture<UpdateProductScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
