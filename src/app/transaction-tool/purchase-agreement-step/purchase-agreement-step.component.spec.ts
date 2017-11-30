import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAgreementStepComponent } from './purchase-agreement-step.component';

describe('PurchaseAgreementStepComponent', () => {
  let component: PurchaseAgreementStepComponent;
  let fixture: ComponentFixture<PurchaseAgreementStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseAgreementStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseAgreementStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
