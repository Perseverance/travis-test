import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefferalLinkComponent } from './refferal-link.component';

describe('RefferalLinkComponent', () => {
  let component: RefferalLinkComponent;
  let fixture: ComponentFixture<RefferalLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefferalLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefferalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
