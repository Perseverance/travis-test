import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDescriptionOverviewComponent } from './property-description-overview.component';

describe('PropertyDescriptionOverviewComponent', () => {
  let component: PropertyDescriptionOverviewComponent;
  let fixture: ComponentFixture<PropertyDescriptionOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDescriptionOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDescriptionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
