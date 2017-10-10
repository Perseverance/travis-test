import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinButtonComponent } from './linkedin-button.component';

describe('LinkedinButtonComponent', () => {
  let component: LinkedinButtonComponent;
  let fixture: ComponentFixture<LinkedinButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
