import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDisclosuresStepComponent } from './seller-disclosures-step.component';

describe('SellerDisclosuresStepComponent', () => {
  let component: SellerDisclosuresStepComponent;
  let fixture: ComponentFixture<SellerDisclosuresStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerDisclosuresStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerDisclosuresStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
