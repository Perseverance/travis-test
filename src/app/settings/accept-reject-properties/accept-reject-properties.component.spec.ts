import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectPropertiesComponent } from './accept-reject-properties.component';

describe('AcceptRejectPropertiesComponent', () => {
  let component: AcceptRejectPropertiesComponent;
  let fixture: ComponentFixture<AcceptRejectPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptRejectPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRejectPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
