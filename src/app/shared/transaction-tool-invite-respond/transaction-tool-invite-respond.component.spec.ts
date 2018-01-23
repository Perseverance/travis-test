import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionToolInviteRespondComponent } from './transaction-tool-invite-respond.component';

describe('TransactionToolInviteRespondComponent', () => {
  let component: TransactionToolInviteRespondComponent;
  let fixture: ComponentFixture<TransactionToolInviteRespondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionToolInviteRespondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionToolInviteRespondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
