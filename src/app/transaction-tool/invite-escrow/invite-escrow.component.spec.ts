import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteEscrowComponent } from './invite-escrow.component';

describe('InviteEscrowComponent', () => {
  let component: InviteEscrowComponent;
  let fixture: ComponentFixture<InviteEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteEscrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
