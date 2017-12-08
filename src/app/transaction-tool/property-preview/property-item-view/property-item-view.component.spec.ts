import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyLoadComponent } from './property-load.component';

describe('PropertyLoadComponent', () => {
  let component: PropertyItemViewComponent;
  let fixture: ComponentFixture<PropertyItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyItemViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
