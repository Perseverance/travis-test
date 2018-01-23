import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreeAndContinueComponent } from './agree-and-continue.component';

describe('AgreeAndContinueComponent', () => {
  let component: AgreeAndContinueComponent;
  let fixture: ComponentFixture<AgreeAndContinueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreeAndContinueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreeAndContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
