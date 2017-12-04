import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionToolComponent } from './transaction-tool.component';

describe('TransactionToolComponent', () => {
  let component: TransactionToolComponent;
  let fixture: ComponentFixture<TransactionToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
