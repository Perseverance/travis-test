import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStepComponent } from './payment-step.component';

describe('PaymentStepComponent', () => {
  let component: PaymentStepComponent;
  let fixture: ComponentFixture<PaymentStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
