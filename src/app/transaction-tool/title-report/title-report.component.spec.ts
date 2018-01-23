import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementStatementStepComponent } from './title-report-step.component';

describe('SettlementStatementStepComponent', () => {
  let component: SettlementStatementStepComponent;
  let fixture: ComponentFixture<SettlementStatementStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementStatementStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementStatementStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
