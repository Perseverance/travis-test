import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionToolInviteComponent } from './transaction-tool-invite.component';

describe('TransactionToolInviteComponent', () => {
  let component: TransactionToolInviteComponent;
  let fixture: ComponentFixture<TransactionToolInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionToolInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionToolInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
