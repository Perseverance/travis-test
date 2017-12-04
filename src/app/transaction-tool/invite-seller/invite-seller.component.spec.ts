import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSellerComponent } from './invite-seller.component';

describe('InviteSellerComponent', () => {
  let component: InviteSellerComponent;
  let fixture: ComponentFixture<InviteSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
