import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementStatementComponent } from './settlement-statement.component';

describe('SettlementStatementComponent', () => {
  let component: SettlementStatementComponent;
  let fixture: ComponentFixture<SettlementStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
