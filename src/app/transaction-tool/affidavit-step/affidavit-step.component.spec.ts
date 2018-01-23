import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffidavitStepComponent } from './affidavit-step.component';

describe('AffidavitStepComponent', () => {
  let component: AffidavitStepComponent;
  let fixture: ComponentFixture<AffidavitStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffidavitStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffidavitStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
