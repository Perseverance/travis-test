import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentStepComponent } from './deposit-payment-step.component';

describe('DepositPaymentStepComponent', () => {
  let component: DepositPaymentStepComponent;
  let fixture: ComponentFixture<DepositPaymentStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
