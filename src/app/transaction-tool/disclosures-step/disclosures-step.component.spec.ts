import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclosuresStepComponent } from './disclosures-step.component';

describe('SellerDisclosuresStepComponent', () => {
  let component: DisclosuresStepComponent;
  let fixture: ComponentFixture<DisclosuresStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisclosuresStepComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclosuresStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
