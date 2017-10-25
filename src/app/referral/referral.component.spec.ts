import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefferalComponent } from './referral.component';

describe('RefferalComponent', () => {
  let component: RefferalComponent;
  let fixture: ComponentFixture<RefferalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefferalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
